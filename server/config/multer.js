import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from './cloudinary.js'

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'instantfix/profiles',   // ✅ change here
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 300, height: 300, crop: 'fill', quality: 'auto' } // ✅ profile optimized
    ]
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // ✅ 2MB enough for profile
})

export default upload