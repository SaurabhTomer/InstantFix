import express from 'express'
import {
    getStats,
    getElectricians,
    getElectricianById,
    updateElectricianStatus,
    getAllRequests,
    getUsers,
    getUserById,
    getRequestById
} from '../controllers/adminController.js'
import auth from '../middleware/auth.js'
import roles from '../middleware/roles.js'



const adminRouter = express.Router()

adminRouter.use(auth, roles('admin'))

adminRouter.get('/stats',                   getStats)
adminRouter.get('/users',                   getUsers)
adminRouter.get('/users/:id',               getUserById)
adminRouter.get('/electricians',            getElectricians)
adminRouter.get('/electricians/:id',        getElectricianById)
adminRouter.put('/electricians/:id/status', updateElectricianStatus)
adminRouter.get('/requests',                getAllRequests)
adminRouter.get('/requests/:id', getRequestById)

export default adminRouter