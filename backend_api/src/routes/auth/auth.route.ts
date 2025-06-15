import express from 'express'
import {
  refreshToken_controller,
  signin_controller,
  signout_controller,
  signup_controller
} from '~/controllers/auth.controller'
import { RefreshToken, SigninDto, SignoutDto, SignupDto } from '~/dto/auth/auth.dto'
import { authInterceptor } from '~/middleware/authInterceptor'
import { validationDTOMiddleware } from '~/middleware/dto.middleware'

const router = express.Router()

// Auth routes
router.post('/signin', validationDTOMiddleware(SigninDto), signin_controller)
router.post('/signup', validationDTOMiddleware(SignupDto), signup_controller)
router.post('/refresh-token', validationDTOMiddleware(RefreshToken), refreshToken_controller)
router.post('/signout', authInterceptor, validationDTOMiddleware(SignoutDto), signout_controller)

export default router
