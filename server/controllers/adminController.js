import User from '../models/User.js'
import Electrician from '../models/Electrician.js'
import ServiceRequest from '../models/ServiceRequest.js'

// ─── Helpers ────────────────────────────────────────────────────────────────

const getPagination = (query) => {
    const page  = Math.max(1, parseInt(query.page)  || 1)
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10))
    const skip  = (page - 1) * limit
    return { page, limit, skip }
}

const buildPaginationMeta = (total, page, limit) => ({
    total,
    page,
    limit,
    totalPages:  Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
})

// ─── Stats ───────────────────────────────────────────────────────────────────

// @route GET /api/admin/stats
export const getStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalElectricians,
            pendingElectricians,
            approvedElectricians,
            rejectedElectricians,
            totalRequests,
            pendingRequests,
            inProgressRequests,
            completedRequests,
            cancelledRequests
        ] = await Promise.all([
            User.countDocuments({ role: 'customer' }),
            Electrician.countDocuments(),
            Electrician.countDocuments({ approvalStatus: 'pending' }),
            Electrician.countDocuments({ approvalStatus: 'approved' }),
            Electrician.countDocuments({ approvalStatus: 'rejected' }),
            ServiceRequest.countDocuments(),
            ServiceRequest.countDocuments({ status: 'pending' }),
            ServiceRequest.countDocuments({ status: 'in-progress' }),
            ServiceRequest.countDocuments({ status: 'completed' }),
            ServiceRequest.countDocuments({ status: 'cancelled' })
        ])

        return res.status(200).json({
            success: true,
            stats: {
                users:        { total: totalUsers },
                electricians: { total: totalElectricians, pending: pendingElectricians, approved: approvedElectricians, rejected: rejectedElectricians },
                requests:     { total: totalRequests, pending: pendingRequests, inProgress: inProgressRequests, completed: completedRequests, cancelled: cancelledRequests }
            }
        })
    } catch (error) {
        next(error)
    }
}

// ─── Electricians ─────────────────────────────────────────────────────────────

// @route GET /api/admin/electricians
export const getElectricians = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query)

        const ALLOWED_STATUSES = ['pending', 'approved', 'rejected']
        const filter = {}
        if (req.query.status) {
            if (!ALLOWED_STATUSES.includes(req.query.status)) {
                return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}` })
            }
            filter.approvalStatus = req.query.status
        }

        const [total, electricians] = await Promise.all([
            Electrician.countDocuments(filter),
            Electrician.find(filter)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
        ])

        return res.status(200).json({
            success: true,
            electricians,
            pagination: buildPaginationMeta(total, page, limit)
        })
    } catch (error) {
        next(error)
    }
}

// @route GET /api/admin/electricians/:id
export const getElectricianById = async (req, res, next) => {
    try {
        const electrician = await Electrician.findById(req.params.id).select('-password').lean()
        if (!electrician) {
            return res.status(404).json({ success: false, message: 'Electrician not found' })
        }
        return res.status(200).json({ success: true, electrician })
    } catch (error) {
        next(error)
    }
}

// @route PUT /api/admin/electricians/:id/status
// Merged approve + reject into one — pass { "status": "approved" | "rejected" } in body
export const updateElectricianStatus = async (req, res, next) => {
    try {
        const ALLOWED_STATUSES = ['approved', 'rejected']
        const { status } = req.body

        if (!status || !ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}` })
        }

        const electrician = await Electrician.findByIdAndUpdate(
            req.params.id,
            { approvalStatus: status },
            { new: true, runValidators: true }
        ).select('-password').lean()

        if (!electrician) {
            return res.status(404).json({ success: false, message: 'Electrician not found' })
        }

        return res.status(200).json({
            success: true,
            electrician,
            message: `Electrician ${status} successfully`
        })
    } catch (error) {
        next(error)
    }
}

// ─── Service Requests ─────────────────────────────────────────────────────────

// @route GET /api/admin/requests
export const getAllRequests = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query)

        const ALLOWED_STATUSES = ['pending', 'in-progress', 'completed', 'cancelled']
        const filter = {}
        if (req.query.status) {
            if (!ALLOWED_STATUSES.includes(req.query.status)) {
                return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}` })
            }
            filter.status = req.query.status
        }

        const [total, requests] = await Promise.all([
            ServiceRequest.countDocuments(filter),
            ServiceRequest.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('customer',     'name email phone')
                .populate('electrician',  'name email phone')
                .lean()
        ])

        return res.status(200).json({
            success: true,
            requests,
            pagination: buildPaginationMeta(total, page, limit)
        })
    } catch (error) {
        next(error)
    }
}

// ─── Users ───────────────────────────────────────────────────────────────────

// @route GET /api/admin/users
export const getUsers = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query)
        const filter = { role: 'customer' }

        const [total, users] = await Promise.all([
            User.countDocuments(filter),
            User.find(filter)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
        ])

        return res.status(200).json({
            success: true,
            users,
            pagination: buildPaginationMeta(total, page, limit)
        })
    } catch (error) {
        next(error)
    }
}



export const getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('assignedElectrician', 'name email phone')
      .lean();
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    return res.status(200).json({ success: true, request });
  } catch (error) {
    next(error);
  }
};