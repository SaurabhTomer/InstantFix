import User from '../models/User.js'
import Electrician from '../models/Electrician.js'
import ServiceRequest from '../models/ServiceRequest.js'

// @route GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalElectricians,
      pendingElectricians,
      approvedElectricians,
      totalRequests,
      pendingRequests,
      completedRequests
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Electrician.countDocuments(),
      Electrician.countDocuments({ approvalStatus: 'pending' }),
      Electrician.countDocuments({ approvalStatus: 'approved' }),
      ServiceRequest.countDocuments(),
      ServiceRequest.countDocuments({ status: 'pending' }),
      ServiceRequest.countDocuments({ status: 'completed' })
    ])

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalElectricians,
        pendingElectricians,
        approvedElectricians,
        totalRequests,
        pendingRequests,
        completedRequests
      }
    })
  } catch (error) {
    next(error)
  }
}

// @route GET /api/admin/electricians
export const getElectricians = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.status) filter.approvalStatus = req.query.status

    const total = await Electrician.countDocuments(filter)

    const electricians = await Electrician.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return res.status(200).json({
      success: true,
      electricians,
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

// @route PUT /api/admin/electricians/:id/approve
export const approveElectrician = async (req, res, next) => {
  try {
    const electrician = await Electrician.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: 'approved' },
      { new: true }
    ).select('-password')

    if (!electrician) {
      return res.status(404).json({ success: false, message: 'Electrician not found' })
    }

    return res.status(200).json({ success: true, electrician, message: 'Electrician approved' })
  } catch (error) {
    next(error)
  }
}

// @route PUT /api/admin/electricians/:id/reject
export const rejectElectrician = async (req, res, next) => {
  try {
    const electrician = await Electrician.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: 'rejected' },
      { new: true }
    ).select('-password')

    if (!electrician) {
      return res.status(404).json({ success: false, message: 'Electrician not found' })
    }

    return res.status(200).json({ success: true, electrician, message: 'Electrician rejected' })
  } catch (error) {
    next(error)
  }
}

// @route GET /api/admin/requests
export const getAllRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.status) filter.status = req.query.status

    const total = await ServiceRequest.countDocuments(filter)

    const requests = await ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('customer', 'name email phone')
      .populate('electrician', 'name email phone')

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

// @route GET /api/admin/users
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const total = await User.countDocuments({ role: 'customer' })

    const users = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return res.status(200).json({
      success: true,
      users,
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