import Electrician from '../models/Electrician.js'
import ServiceRequest from '../models/ServiceRequest.js'

// ─── Update Profile ───────────────────────────────────────────────────────────

// @route PUT /api/electrician/profile
export const updateElectricianProfile = async (req, res, next) => {
    try {
        const electrician = await Electrician.findById(req.user.id)

        if (!electrician) {
            return res.status(404).json({ success: false, message: 'Electrician not found' })
        }

        const { name, phone, experience, hourlyRate, address } = req.body

        if (name)  electrician.name  = name.trim()
        if (phone) electrician.phone = phone.trim()

        if (experience !== undefined) {
            const exp = parseFloat(experience)
            if (isNaN(exp) || exp < 0) {
                return res.status(400).json({ success: false, message: 'Experience must be a non-negative number' })
            }
            electrician.experience = exp
        }

        if (hourlyRate !== undefined) {
            const rate = parseFloat(hourlyRate)
            if (isNaN(rate) || rate <= 0) {
                return res.status(400).json({ success: false, message: 'Hourly rate must be a positive number' })
            }
            electrician.hourlyRate = rate
        }

        if (address) {
            let parsedAddress
            try {
                parsedAddress = typeof address === 'string' ? JSON.parse(address) : address
            } catch {
                return res.status(400).json({ success: false, message: 'Invalid address format' })
            }

            // Ensure nested address object exists before merging
            if (!electrician.address) electrician.address = {}

            const { street, city, state, pincode } = parsedAddress
            if (street)  electrician.address.street  = street.trim()
            if (city)    electrician.address.city    = city.trim()
            if (state)   electrician.address.state   = state.trim()
            if (pincode) electrician.address.pincode = pincode.trim()
        }

        // Avatar uploaded via multer → cloudinary URL stored in req.file.path
        if (req.file?.path) {
            electrician.avatar = req.file.path
        }

        await electrician.save()

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            electrician: {
                id:             electrician._id,
                name:           electrician.name,
                email:          electrician.email,
                phone:          electrician.phone,
                experience:     electrician.experience,
                hourlyRate:     electrician.hourlyRate,
                address:        electrician.address,
                approvalStatus: electrician.approvalStatus,
                avatar:         electrician.avatar
            }
        })
    } catch (error) {
        next(error)
    }
}

// ─── Update Location ──────────────────────────────────────────────────────────

// @route PUT /api/electrician/location
export const updateLocation = async (req, res, next) => {
    try {
        const { longitude, latitude } = req.body

        if (longitude === undefined || latitude === undefined) {
            return res.status(400).json({ success: false, message: 'Both longitude and latitude are required' })
        }

        const lng = parseFloat(longitude)
        const lat = parseFloat(latitude)

        if (isNaN(lng) || isNaN(lat)) {
            return res.status(400).json({ success: false, message: 'Coordinates must be valid numbers' })
        }

        if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
            return res.status(400).json({ success: false, message: 'Coordinates are out of valid range' })
        }

        const electrician = await Electrician.findByIdAndUpdate(
            req.user.id,
            { location: { type: 'Point', coordinates: [lng, lat] } },
            { new: true }
        ).select('-password')

        if (!electrician) {
            return res.status(404).json({ success: false, message: 'Electrician not found' })
        }

        return res.status(200).json({
            success: true,
            message: 'Location updated successfully',
            location: electrician.location
        })
    } catch (error) {
        next(error)
    }
}

// ─── Get Nearby Jobs ──────────────────────────────────────────────────────────

// @route GET /api/electrician/jobs/nearby
export const getNearbyJobs = async (req, res, next) => {
    try {
        const radiusKm = Math.min(100, Math.max(1, parseFloat(req.query.radius) || 10))  // clamp 1–100 km
        const page     = Math.max(1, parseInt(req.query.page)  || 1)
        const limit    = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10))
        const skip     = (page - 1) * limit

        const electrician = await Electrician.findById(req.user.id)
            .select('location approvalStatus')
            .lean()

        if (!electrician) {
            return res.status(404).json({ success: false, message: 'Electrician not found' })
        }

        if (electrician.approvalStatus !== 'approved') {
            return res.status(403).json({ success: false, message: 'Your account is not approved yet' })
        }

        // BUG FIX: original did destructuring without checking if location/coordinates exist
        // This would crash if electrician never set their location
        if (
            !electrician.location ||
            !electrician.location.coordinates ||
            electrician.location.coordinates.length < 2
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please update your location before searching for jobs'
            })
        }

        // ADD this instead:
let lng, lat

if (req.query.lat && req.query.lng) {
  lat = parseFloat(req.query.lat)
  lng = parseFloat(req.query.lng)
} else {
  [lng, lat] = electrician.location.coordinates;
}
        // BUG FIX: (0, 0) check was after destructuring — moved safety check before it.
        // Also: valid coords can be 0 in some edge cases, so checking both being 0
        // simultaneously is a reasonable "unset" sentinel only if your schema defaults to [0,0]
        if (lng === 0 && lat === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please update your location before searching for jobs'
            })
        }

        const radiusMeters = radiusKm * 1000

        const geoNearStage = {
            $geoNear: {
                near:          { type: 'Point', coordinates: [lng, lat] },
                distanceField: 'distanceMeters',
                maxDistance:   radiusMeters,
                spherical:     true,
                query:         { status: 'pending', electrician: null }
            }
        }

        // Run data + count in parallel — same as original (good pattern)
        const [jobs, totalAgg] = await Promise.all([
            ServiceRequest.aggregate([
                geoNearStage,
                { $sort: { distanceMeters: 1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from:         'users',
                        localField:   'customer',
                        foreignField: '_id',
                        as:           'customer',
                        pipeline:     [{ $project: { name: 1, phone: 1 } }]
                    }
                },
                { $unwind: '$customer' },
                {
                    $addFields: {
                        distanceKm: { $round: [{ $divide: ['$distanceMeters', 1000] }, 2] }
                    }
                }
            ]),
            ServiceRequest.aggregate([
                geoNearStage,
                { $count: 'total' }
            ])
        ])

        const total = totalAgg[0]?.total || 0

        return res.status(200).json({
            success: true,
            radiusKm,
            jobs,
            pagination: {
                total,
                page,
                limit,
                totalPages:  Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        })
    } catch (error) {
        next(error)
    }
}

// ─── Get Own Profile ──────────────────────────────────────────────────────────

// @route GET /api/electrician/profile
export const getElectricianProfile = async (req, res, next) => {
    try {
        const electrician = await Electrician.findById(req.user.id)
            .select('-password')
            .lean()

        if (!electrician) {
            return res.status(404).json({ success: false, message: 'Electrician not found' })
        }

        return res.status(200).json({ success: true, electrician })
    } catch (error) {
        next(error)
    }
}