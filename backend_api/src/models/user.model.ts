import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    profilePicture: {
      type: String,
      default: ''
    },
    publicPictureId: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

const UserModel = mongoose.model('User', userSchema)
export default UserModel
