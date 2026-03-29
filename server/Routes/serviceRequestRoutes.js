import express from 'express'
import {
  createRequest,
  getMyRequests,
  getRequestById,
  cancelRequest
} from '../controllers/serviceRequestController.js'
import auth from '../middleware/auth.js'
import roles from '../middleware/roles.js'
import upload from '../config/multer.js'

const router = express.Router()

router.post('/', auth, roles('customer'), upload.array('photos', 5), createRequest)
router.get('/my', auth, roles('customer'), getMyRequests)
router.get('/:id', auth, roles('customer'), getRequestById)
router.put('/:id/cancel', auth, roles('customer'), cancelRequest)

export default router