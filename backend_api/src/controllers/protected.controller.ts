import { deleteImage, uploadImage } from '~/lib/cloudinary'
import UserModel from '~/models/user.model'
import fs from 'fs'
import { Request, Response } from 'express'

export const getProfileController = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user.id
    const user = await UserModel.findById(userId).select('-password -__v')
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.status(200).json({
      message: 'User profile retrieved successfully',
      status: 'success',
      data: user
    })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const protectedController = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user.id
  const user = await UserModel.findById(userId)
  if (!user) return res.status(404).json({ error: 'User not found' })

  if (req.file) {
    if (user.profilePicture) {
      await deleteImage(user.publicPictureId)
    }

    const result = await uploadImage(req.file.path, 'avatars')

    fs.unlinkSync(req.file.path)
    user.profilePicture = result.secure_url
    user.publicPictureId = result.public_id
    await user.save()
    return res.status(200).json({
      message: 'Profile picture updated successfully',
      status: 'success',
      data: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        publicPictureId: user.publicPictureId
      }
    })
  }
}
