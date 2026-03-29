import express from 'express'
import {
  getStats,
  getElectricians,
  approveElectrician,
  rejectElectrician,
  getAllRequests,
  getUsers
} from '../controllers/adminController.js'
import auth from '../middleware/auth.js'
import roles from '../middleware/roles.js'

const adminRouter = express.Router()

// sab routes admin only
adminRouter.use(auth, roles('admin'))

adminRouter.get('/stats', getStats)
adminRouter.get('/electricians', getElectricians)
adminRouter.put('/electricians/:id/approve', approveElectrician)
adminRouter.put('/electricians/:id/reject', rejectElectrician)
adminRouter.get('/requests', getAllRequests)
adminRouter.get('/users', getUsers)

export default adminRouter