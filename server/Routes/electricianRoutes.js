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
router.use(auth, roles('electrician'))

// ─── Profile Management ────────────────────────────────────────────────
router.get('/profile', getElectricianProfile)
router.put('/profile', upload.single('avatar'), updateElectricianProfile)
router.put('/location', updateLocation)

// ─── Job Management ───────────────────────────────────────────────────
router.get('/jobs', getMyJobs)
router.get('/jobs/stats', getJobStats)
router.get('/jobs/:id', getJobById)
router.put('/jobs/:id/accept', acceptJob)
router.put('/jobs/:id/start', startJob)
router.put('/jobs/:id/complete', completeJob)

// ─── Nearby Jobs ─────────────────────────────────────────────────────
router.get('/jobs/nearby', getNearbyJobs)

export default electricianRouter
