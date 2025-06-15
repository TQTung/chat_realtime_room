import { Request, Response } from 'express'
import { uploadImage } from '~/lib/cloudinary'
import MessageModel from '~/models/message.model'
import UserModel from '~/models/user.model'
import fs from 'fs'
import { getReceiverSocketId, socketServer } from '~/lib/socket'

export const getUserForSidebarController = async (req: Request, res: Response): Promise<any> => {
  try {
    const loggedUserId = req.user.id
    const filteredUsers = await UserModel.find({ _id: { $ne: loggedUserId } }).select('-password')
    return res.status(200).json({
      message: 'User data for sidebar',
      status: 'success',
      data: filteredUsers
    })
  } catch (error) {
    console.error('Error fetching user for sidebar:', error)
    return res.status(500).json({
      message: 'Internal server error',
      status: 'error'
    })
  }
}

export const getMessages = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id: userChatId } = req.params
    const senderId = req.user.id
    const messages = await MessageModel.find({
      $or: [
        { senderId, receiverId: userChatId },
        { senderId: userChatId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 })

    return res.status(200).json({
      message: 'Messages fetched successfully',
      status: 'success',
      data: messages
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return res.status(500).json({
      message: 'Internal server error',
      status: 'error'
    })
  }
}

export const sendMessageController = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id: receiverId } = req.params
    const senderId = req.user.id
    const { text } = req.body
    const imagePath = req.file ? req.file.path : undefined
    let imageUrl
    if (imagePath) {
      const uploadResponse = await uploadImage(imagePath, 'message-images')
      fs.unlinkSync(imagePath)
      imageUrl = uploadResponse.secure_url
    }
    const message = new MessageModel({
      senderId,
      receiverId,
      content: text,
      image: imageUrl
    })
    await message.save()

    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      console.log('receiverSocketId', receiverSocketId)
      socketServer.to(receiverSocketId).emit('newMessage', message)
    }
    return res.status(201).json({
      message: 'Message sent successfully',
      status: 'success',
      data: message
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return res.status(500).json({
      message: 'Internal server error',
      status: 'error'
    })
  }
}
