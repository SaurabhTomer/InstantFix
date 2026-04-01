import express from 'express'
import {
    getStats,
    getElectricians,
    getElectricianById,
    updateElectricianStatus,
    getAllRequests,
    getUsers
} from '../controllers/adminController.js'
import auth from '../middleware/auth.js'
import roles from '../middleware/roles.js'

const adminRouter = express.Router()

// All routes — admin only
adminRouter.use(auth, roles('admin'))

// Stats
adminRouter.get('/stats', getStats)

// Users
adminRouter.get('/users', getUsers)

// Electricians
adminRouter.get('/electricians',          getElectricians)
adminRouter.get('/electricians/:id',      getElectricianById)
adminRouter.put('/electricians/:id/status', updateElectricianStatus)

// Service Requests
adminRouter.get('/requests', getAllRequests)

export default adminRouter