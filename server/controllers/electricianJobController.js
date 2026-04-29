import mongoose from 'mongoose'
import ServiceRequest from '../models/ServiceRequest.js'
import Electrician from '../models/Electrician.js'
import { emitToUser } from '../config/socket.js'
import {
    sendJobAcceptedEmail,
    sendJobStartedEmail,
    sendJobCompletedEmail,
} from '../utils/sendEmail.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const ALLOWED_JOB_STATUSES = ['pending', 'accepted', 'started', 'completed', 'cancelled']

// ─── Get My Jobs ──────────────────────────────────────────────────────────────

// @route GET /api/electrician/jobs
export const getMyJobs = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query)
        const filter = { electrician: req.user.id }

        if (req.query.status) {
            if (!ALLOWED_JOB_STATUSES.includes(req.query.status)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status. Allowed: ${ALLOWED_JOB_STATUSES.join(', ')}`
                })
            }
            filter.status = req.query.status
        }

        const [total, jobs] = await Promise.all([
            ServiceRequest.countDocuments(filter),
            ServiceRequest.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('customer', 'name phone avatar')
                .lean()
        ])

        return res.status(200).json({
            success: true,
            jobs,
            pagination: buildPaginationMeta(total, page, limit)
        })
    } catch (error) {
        next(error)
    }
}

// ─── Get Job Stats ────────────────────────────────────────────────────────────

// @route GET /api/electrician/jobs/stats
export const getJobStats = async (req, res, next) => {
    try {
        const electricianId = new mongoose.Types.ObjectId(req.user.id)

        // Single aggregation instead of 3 countDocuments + 1 aggregate = 4 DB calls → 1
        const [statusCounts, earningsAgg] = await Promise.all([
            ServiceRequest.aggregate([
                { $match: { electrician: electricianId } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            ServiceRequest.aggregate([
                { $match: { electrician: electricianId, status: 'completed' } },
                {
                    $group: {
                        _id: null,
                        totalEarnings: { $sum: '$totalAmount' },
                        paidEarnings: {
                            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] }
                        }
                    }
                }
            ])
        ])

        // Map status counts into a lookup object
        const counts = statusCounts.reduce((acc, { _id, count }) => {
            acc[_id] = count
            return acc
        }, {})

        const earnings = earningsAgg[0] || { totalEarnings: 0, paidEarnings: 0 }

        return res.status(200).json({
            success: true,
            stats: {
                accepted:      counts.accepted  || 0,
                started:       counts.started   || 0,
                completed:     counts.completed || 0,
                cancelled:     counts.cancelled || 0,
                totalEarnings: parseFloat(earnings.totalEarnings.toFixed(2)),
                paidEarnings:  parseFloat(earnings.paidEarnings.toFixed(2)),
                pendingPayout: parseFloat((earnings.totalEarnings - earnings.paidEarnings).toFixed(2))
            }
        })
    } catch (error) {
        next(error)
    }
}

// ─── Get Job By ID ────────────────────────────────────────────────────────────

// @route GET /api/electrician/jobs/:id
export const getJobById = async (req, res, next) => {
    try {
        const job = await ServiceRequest.findById(req.params.id)
            .populate('customer', 'name phone avatar')
            .lean()

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' })
        }

        if (job.electrician?.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied — this job is not assigned to you' })
        }

        return res.status(200).json({ success: true, job })
    } catch (error) {
        next(error)
    }
}

// ─── Accept Job ───────────────────────────────────────────────────────────────

// @route PUT /api/electrician/jobs/:id/accept
export const acceptJob = async (req, res, next) => {
    try {
        const electrician = await Electrician.findById(req.user.id)
            .select('approvalStatus hourlyRate')
            .lean()

        if (!electrician) {
            return res.status(404).json({ success: false, message: 'Electrician not found' })
        }

        if (electrician.approvalStatus !== 'approved') {
            return res.status(403).json({ success: false, message: 'Your account is not approved yet' })
        }

        if (!electrician.hourlyRate || electrician.hourlyRate === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please set your hourly rate in your profile before accepting jobs'
            })
        }

        // findOneAndUpdate with atomic conditions prevents race condition
        // (two electricians accepting same job simultaneously)
        const job = await ServiceRequest.findOneAndUpdate(
            { _id: req.params.id, status: 'pending', electrician: null },
            { electrician: req.user.id, status: 'accepted', hourlyRate: electrician.hourlyRate },
            { returnDocument: 'after' }
        ).populate('customer', 'name phone avatar email')

        if (!job) {
            // Distinguish between not found vs already taken
            const original = await ServiceRequest.findById(req.params.id).select('status electrician').lean()
            if (!original) {
                return res.status(404).json({ success: false, message: 'Job request not found' })
            }
            return res.status(409).json({ success: false, message: 'This job has already been taken or is no longer available' })
        }

          // Notify customer that their request has been accepted
        emitToUser(job.customer._id, 'request_update', {
            requestId: job._id,
            status:    'accepted',
            message:   `${electrician.name} ne tumhara request accept kar liya`,
            electrician: {
                name:       electrician.name,
                hourlyRate: electrician.hourlyRate
            }
        })

        if (job.customer.email) {
            sendJobAcceptedEmail(job.customer.email, {
                electricianName: electrician.name,
                hourlyRate:      electrician.hourlyRate,
                category:        job.category,
            }).catch(console.error)
        }

        return res.status(200).json({ success: true, message: 'Job accepted successfully', job })
    } catch (error) {
        next(error)
    }
}

// ─── Start Job ────────────────────────────────────────────────────────────────

// @route PUT /api/electrician/jobs/:id/start
export const startJob = async (req, res, next) => {
    try {
        const job = await ServiceRequest.findOneAndUpdate(
            { _id: req.params.id, electrician: req.user.id, status: 'accepted' },
            { $set: { status: 'started', startTime: new Date() } },
            { new: true, runValidators: true }
        ).populate('customer', 'name phone avatar email')

        if (!job) {
            // Distinguish between not found, not yours, or wrong status
            const original = await ServiceRequest.findById(req.params.id).select('status electrician').lean()
            if (!original) {
                return res.status(404).json({ success: false, message: 'Job not found' })
            }
            if (original.electrician?.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Access denied — this job is not assigned to you' })
            }
            return res.status(400).json({
                success: false,
                message: `Cannot start a job with status '${original.status}'. Job must be accepted first.`
            })
        }

          // Notify customer that electrician has started the job
        emitToUser(job.customer._id, 'request_update', {
            requestId: job._id,
            status:    'started',
            message:   'Electrician ne kaam shuru kar diya hai',
            startTime: job.startTime
        })

        if (job.customer.email) {
            sendJobStartedEmail(job.customer.email, {
                electricianName: req.user.name || 'Your electrician',
                category:        job.category,
            }).catch(console.error)
        }

        return res.status(200).json({
            success: true,
            message: 'Job started. Timer is now running.',
            job: { id: job._id, status: job.status, startTime: job.startTime, hourlyRate: job.hourlyRate }
        })
    } catch (error) {
        next(error)
    }
}

// ─── Complete Job ─────────────────────────────────────────────────────────────

// @route PUT /api/electrician/jobs/:id/complete
export const completeJob = async (req, res, next) => {
    try {
        // Fetch first to validate, then update
        const job = await ServiceRequest.findById(req.params.id)

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' })
        }

        if (job.electrician?.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied — this job is not assigned to you' })
        }

        if (job.status !== 'started') {
            return res.status(400).json({
                success: false,
                message: `Cannot complete a job with status '${job.status}'. Job must be started first.`
            })
        }

        if (!job.startTime) {
            return res.status(400).json({ success: false, message: 'startTime is missing — cannot calculate total amount' })
        }

        const endTime       = new Date()
        const durationMs    = endTime - new Date(job.startTime)
        const durationHours = durationMs / (1000 * 60 * 60)
        const billedHours   = Math.max(durationHours, 1)          // minimum 1 hour billing
        const totalAmount   = parseFloat((billedHours * job.hourlyRate).toFixed(2))

        job.status      = 'completed'
        job.endTime     = endTime
        job.totalAmount = totalAmount
        await job.save()

        await job.populate('customer', 'name phone avatar email')


          // Notify customer that job is complete and payment is due
        emitToUser(job.customer._id, 'request_update', {
            requestId:   job._id,
            status:      'completed',
            message:     'Kaam complete ho gaya. Please payment karein.',
            totalAmount: job.totalAmount,
            endTime:     job.endTime
        })

        if (job.customer.email) {
            sendJobCompletedEmail(job.customer.email, {
                totalAmount: job.totalAmount,
                category:    job.category,
                billedHours: parseFloat(billedHours.toFixed(2)),
                hourlyRate:  job.hourlyRate,
            }).catch(console.error)
        }

        return res.status(200).json({
            success: true,
            message: 'Job completed successfully',
            job: {
                id:            job._id,
                status:        job.status,
                startTime:     job.startTime,
                endTime:       job.endTime,
                durationHours: parseFloat(durationHours.toFixed(2)),
                billedHours:   parseFloat(billedHours.toFixed(2)),
                hourlyRate:    job.hourlyRate,
                totalAmount:   job.totalAmount,
                paymentStatus: job.paymentStatus,
                customer:      job.customer
            }
        })
    } catch (error) {
        next(error)
    }
}