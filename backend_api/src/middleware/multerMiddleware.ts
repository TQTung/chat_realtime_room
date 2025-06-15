import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    const extend = path.extname(file.originalname)
    const name = path.basename(file.originalname, extend)
    const uniqueName = `${name}-${Date.now()}${extend}`
    cb(null, uniqueName)
  }
})
const upload = multer({ storage })

export default upload
