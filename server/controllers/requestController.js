import ServiceRequest from '../models/ServiceRequest.js'
import Electrician from '../models/Electrician.js'
import { emitToUser } from '../config/socket.js'

// ─────────────────────────────────────────────────────────
// @route POST /api/requests
// @desc  Customer creates a new service request
// @access Private (customer)
// ─────────────────────────────────────────────────────────
export const createRequest = async (req, res, next) => {
  try {
    const { category, description } = req.body

    if (!category || !description) {
      return res.status(400).json({ success: false, message: 'Category and description are required' })
    }

    // Parse address safely
    let address = {}
    if (req.body.address) {
      try {
        address = typeof req.body.address === 'string'
          ? JSON.parse(req.body.address)
          : req.body.address
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid address format' })
      }
    }

    // Parse and validate location
    let location
    try {
      location = req.body.location
        ? (typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location)
        : null
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid location format' })
    }

    if (
      !location ||
      !location.coordinates ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2 ||
      (location.coordinates[0] === 0 && location.coordinates[1] === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Valid location (longitude, latitude) is required to create a service request'
      })
    }

    const [lng, lat] = location.coordinates

    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return res.status(400).json({ success: false, message: 'Location coordinates are out of range' })
    }

    const photos = req.files ? req.files.map(file => file.path) : []

    const request = await ServiceRequest.create({
      customer: req.user.id,
      category,
      description,
      address,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      photos
    })

    // Find nearby approved electricians within 5km radius
    // and notify each one about the new request via socket
    try {
      const nearbyElectricians = await Electrician.find({
        approvalStatus: 'approved',
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: 5000
          }
        }
      }).select('_id')

      nearbyElectricians.forEach(electrician => {
        emitToUser(electrician._id, 'new_request', {
          message: 'A new job request is available near your location',
          request: {
            _id: request._id,
            category: request.category,
            description: request.description,
            address: request.address,
            createdAt: request.createdAt
          }
        })
      })
    } catch (socketError) {
      // Socket notification failure should not block the main response
      console.error('Socket notification failed:', socketError.message)
    }

    return res.status(201).json({ success: true, request })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────
// @route GET /api/requests/my
// @desc  Get all requests made by this customer
// @access Private (customer)
// ─────────────────────────────────────────────────────────
export const getMyRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = { customer: req.user.id }

    if (req.query.status) {
      const allowed = ['pending', 'accepted', 'started', 'completed', 'cancelled']
      if (!allowed.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed: ${allowed.join(', ')}`
        })
      }
      filter.status = req.query.status
    }

    const [total, requests] = await Promise.all([
      ServiceRequest.countDocuments(filter),
      ServiceRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('electrician', 'name phone hourlyRate experience')
    ])

    return res.status(200).json({
      success: true,
      requests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────
// @route GET /api/requests/:id
// @desc  Get single request detail (only owner can view)
// @access Private (customer)
// ─────────────────────────────────────────────────────────
export const getRequestById = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('electrician', 'name phone hourlyRate experience address')
      .populate('customer', 'name phone')

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' })
    }

    if (request.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    return res.status(200).json({ success: true, request })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────
// @route PUT /api/requests/:id/cancel
// @desc  Customer cancels a pending request
// @access Private (customer)
// ─────────────────────────────────────────────────────────
export const cancelRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' })
    }

    if (request.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Only pending requests can be cancelled. Current status: '${request.status}'`
      })
    }

    request.status = 'cancelled'
    await request.save()


    // Notify assigned electrician if any that request has been cancelled
    if (request.electrician) {
      emitToUser(request.electrician, 'request_cancelled', {
        message: 'Customer ne request cancel kar di',
        requestId: request._id
      })
    }

    return res.status(200).json({ success: true, message: 'Request cancelled successfully' })
  } catch (error) {
    next(error)
  }
}
