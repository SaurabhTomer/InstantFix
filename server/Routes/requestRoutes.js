import express from 'express'
import {
    createRequest,
    getMyRequests,
    getRequestById,
    cancelRequest
} from '../controllers/requestController.js'
import auth from '../middleware/auth.js'
import roles from '../middleware/roles.js'
import upload from '../config/multer.js'

const router = express.Router()

router.use(auth, roles('customer'))

router.post('/',          upload.array('photos', 5), createRequest)
router.get('/my',         getMyRequests)
router.get('/:id',        getRequestById)
router.put('/:id/cancel', cancelRequest)

export default router