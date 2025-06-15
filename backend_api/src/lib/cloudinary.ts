import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary'
import { config } from 'dotenv'

config()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})
export const uploadImage = async (
  filePath: string,
  folderName: string = 'common_folder'
): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      use_filename: true,
      unique_filename: false
    })
    return result
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to upload image: ${error.message}`)
    } else {
      throw new Error('Failed to upload image: Unknown error')
    }
  }
}
export const deleteImage = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete image: ${error.message}`)
    } else {
      throw new Error('Failed to delete image: Unknown error')
    }
  }
}

export default cloudinary
