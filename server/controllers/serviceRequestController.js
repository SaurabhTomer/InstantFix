import ServiceRequest from '../models/ServiceRequest.js'

// @route POST /api/requests
export const createRequest = async (req, res, next) => {
  try {
    const { category, description } = req.body
    const address = req.body.address ? JSON.parse(req.body.address) : {}
    const location = req.body.location ? JSON.parse(req.body.location) : {
      type: 'Point',
      coordinates: [0, 0]
    }

    const photos = req.files ? req.files.map(file => file.path) : []

    const request = await ServiceRequest.create({
      customer: req.user.id,
      category,
      description,
      address,
      location,
      photos
    })
    // console.log(request);
    

    return res.status(201).json({ success: true, request })
  } catch (error) {
    next(error)
  }
}

// @route GET /api/requests/my
export const getMyRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = { customer: req.user.id }

    // status filter optional
    if (req.query.status) {
      filter.status = req.query.status
    }

    const total = await ServiceRequest.countDocuments(filter)

    const requests = await ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('electrician', 'name phone rating')

    // console.log(requests);
    

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

// @route GET /api/requests/:id
export const getRequestById = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('electrician', 'name phone rating')
      .populate('customer', 'name phone')

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' })
    }

    // sirf apni request dekh sake
    if (request.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    return res.status(200).json({ success: true, request })
  } catch (error) {
    next(error)
  }
}

// @route PUT /api/requests/:id/cancel
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
      return res.status(400).json({ success: false, message: 'Only pending requests can be cancelled' })
    }

    request.status = 'cancelled'
    await request.save()

    return res.status(200).json({ success: true, message: 'Request cancelled successfully' })
  } catch (error) {
    next(error)
  }
}