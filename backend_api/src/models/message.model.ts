import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const messageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4
    },
    senderId: {
      type: String,
      ref: 'User',
      required: true,
      default: uuidv4
    },
    receiverId: {
      type: String,
      ref: 'User',
      required: true,
      default: uuidv4
    },
    content: {
      type: String
    },
    image: {
      type: String
    }
  },
  { timestamps: true }
)

const MessageModel = mongoose.model('Message', messageSchema)
export default MessageModel
