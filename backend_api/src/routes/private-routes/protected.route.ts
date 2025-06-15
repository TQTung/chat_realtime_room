import express from 'express'
import { getMessages, getUserForSidebarController, sendMessageController } from '~/controllers/message.controller'
import { getProfileController, protectedController } from '~/controllers/protected.controller'
import { authInterceptor } from '~/middleware/authInterceptor'
import upload from '~/middleware/multerMiddleware'

const router = express.Router()
//protected routes
router.get('/me', authInterceptor, getProfileController)
router.put('/update-profile', authInterceptor, upload.single('avatar'), protectedController)

//message routes
router.get('/message/users', authInterceptor, getUserForSidebarController)
router.get('/message/:id', authInterceptor, getMessages)

router.post('/message/send/:id', authInterceptor, upload.single('messageImages'), sendMessageController)

export default router
