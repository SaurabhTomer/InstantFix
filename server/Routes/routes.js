import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

// Controllers
import {
  getElectricianProfile,
  updateElectricianProfile,
  updateLocation,
  getNearbyJobs
} from '../controllers/electricianController.js'

import {
  getMyJobs,
  getJobById,
  getJobStats,
  acceptJob,
  startJob,
  completeJob
} from '../controllers/electricianJobController.js'

import {
  createRequest,
  getMyRequests,
  getRequestById,
  cancelRequest
} from '../controllers/requestController.js'

// ─────────────────────────────────────────────────────────
// ELECTRICIAN ROUTES  →  /api/electrician
// ─────────────────────────────────────────────────────────
const electricianRouter = express.Router()
electricianRouter.use(protect, authorizeRoles('electrician'))

// Profile
electricianRouter.get('/profile',                    getElectricianProfile)
electricianRouter.put('/profile', upload.single('avatar'), updateElectricianProfile)

// Location
electricianRouter.put('/location',                   updateLocation)

// Jobs
electricianRouter.get('/jobs/nearby',                getNearbyJobs)        // GET /api/electrician/jobs/nearby?radius=10
electricianRouter.get('/jobs/stats',                 getJobStats)          // GET /api/electrician/jobs/stats
electricianRouter.get('/jobs',                       getMyJobs)            // GET /api/electrician/jobs?status=accepted
electricianRouter.get('/jobs/:id',                   getJobById)           // GET /api/electrician/jobs/:id
electricianRouter.put('/jobs/:id/accept',            acceptJob)            // PUT /api/electrician/jobs/:id/accept
electricianRouter.put('/jobs/:id/start',             startJob)             // PUT /api/electrician/jobs/:id/start
electricianRouter.put('/jobs/:id/complete',          completeJob)          // PUT /api/electrician/jobs/:id/complete

export { electricianRouter }


// ─────────────────────────────────────────────────────────
// CUSTOMER REQUEST ROUTES  →  /api/requests
// ─────────────────────────────────────────────────────────
const requestRouter = express.Router()
requestRouter.use(protect, authorizeRoles('customer'))

requestRouter.post('/',          upload.array('photos', 5), createRequest)  // POST   /api/requests
requestRouter.get('/my',                                    getMyRequests)  // GET    /api/requests/my
requestRouter.get('/:id',                                   getRequestById) // GET    /api/requests/:id
requestRouter.put('/:id/cancel',                            cancelRequest)  // PUT    /api/requests/:id/cancel

export { requestRouter }

