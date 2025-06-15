import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { decodeToken, generateToken } from '~/lib/utils'
import UserModel from '~/models/user.model'
import { v4 as uuidV4 } from 'uuid'

export const signin_controller = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        status: 'error'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid password',
        status: 'error'
      })
    }
    return res.status(200).json({
      message: 'User signed in successfully',
      status: 'success',
      data: generateToken({
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture
      })
    })
  } catch (error) {
    console.log('error :>> ', error)
    return res.status(500).json({
      message: 'Internal server error',
      status: 'error'
    })
  }
}

export const signup_controller = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = uuidV4()
    const { email, password, fullName, profilePicture } = req.body

    if (password.length > 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long',
        status: 'error'
      })
    }
    const user = await UserModel.findOne({ email })
    if (user) {
      return res.status(400).json({
        message: 'User already exists',
        status: 'error'
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await new UserModel({
      _id: userId,
      email: email.toLowerCase(),
      fullName,
      password: hashedPassword,
      profilePicture
    }).save()
    return res.status(201).json({
      message: 'User created successfully',
      status: 'success',
      data: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePicture: newUser.profilePicture
      }
    })
  } catch (error) {
    console.error('Error during sign up:', error)
    return res.status(500).json({
      message: 'Internal server error',
      status: 'error'
    })
  }
}

export const signout_controller = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.body
    await UserModel.updateOne({ _id: userId }, { $set: { refreshToken: '' } })
    return res.status(200).json({
      message: 'User signed out successfully',
      status: 'success'
    })
  } catch (error) {
    console.error('Error during sign out:', error)
    return res.status(500).json({
      message: 'Internal server error',
      status: 'error'
    })
  }
}

export const refreshToken_controller = async (req: Request, res: Response): Promise<any> => {
  try {
    const { refreshToken } = req.body
    const rfToken = decodeToken(refreshToken)
    const user = await UserModel.findOne({ _id: rfToken.userId })
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        status: 'error'
      })
    }
    return res.status(200).json({
      message: 'Token refreshed successfully',
      status: 'success',
      data: generateToken({
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture
      })
    })
  } catch (error) {
    console.error('Error during token refresh:', error)
    return res.status(500).json({
      message: 'Internal server error',
      status: 'error'
    })
  }
}
