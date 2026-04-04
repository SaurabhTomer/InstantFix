import express from 'express'
import auth from '../middleware/auth.js'
import roles from '../middleware/roles.js'
import upload from '../config/multer.js'

// Import all electrician controllers
import {
    updateElectricianProfile,
    updateLocation,
    getNearbyJobs,
    getElectricianProfile
} from '../controllers/electricianController.js'

import {
    getMyJobs,
    getJobStats,
    getJobById,
    acceptJob,
    startJob,
    completeJob
} from '../controllers/electricianJobController.js'

const electricianRouter = express.Router()

// Apply authentication and electrician role middleware to all routes
electricianRouter.use(auth, roles('electrician'))

// ─── Profile Management ────────────────────────────────────────────────
electricianRouter.get('/profile', getElectricianProfile)
electricianRouter.put('/profile', upload.single('avatar'), updateElectricianProfile)
electricianRouter.put('/location', updateLocation)

// ─── Job Management ───────────────────────────────────────────────────
electricianRouter.get('/jobs', getMyJobs)
electricianRouter.get('/jobs/stats', getJobStats)
electricianRouter.get('/jobs/:id', getJobById)
electricianRouter.put('/jobs/:id/accept', acceptJob)
electricianRouter.put('/jobs/:id/start', startJob)
electricianRouter.put('/jobs/:id/complete', completeJob)

// ─── Nearby Jobs ─────────────────────────────────────────────────────
electricianRouter.get('/jobs/nearby', getNearbyJobs)

export default electricianRouter
