import {v2 as cloudinary} from 'cloudinary';
import {env} from "../config/env.js";

type UploadResult = {
  secureUrl: string;
  publicId: string;
}

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
})

export async function uploadImageToCloudinary(
  buffer: Buffer,
  options?: {folder?: string}
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({
      resource_type: 'image',
      folder: options?.folder || 'default',
    }, (error, result) => {
      if (error) {
        reject(error)
        return
      }

      resolve({
        secureUrl: result?.secure_url ?? '',
        publicId: result?.public_id ?? '',
      })
    })

    uploadStream.end(buffer);
  })
}

export function deleteImageFromCloudinary(publicId: string): Promise<any> {
  return cloudinary.uploader.destroy(publicId);
}