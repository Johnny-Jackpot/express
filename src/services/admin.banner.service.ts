import type {Banner} from "../types/banner.js";
import {AppError} from "../errors/AppError.js";
import {uploadBannerImageToCloudinary} from "../lib/cloudinary.js";
import {createAdminBanner} from "../repositories/admin.banner.repository.js";

export async function uploadAdminBanner(
  file: Express.Multer.File | undefined
): Promise<Banner> {
  if (!file) {
    throw new AppError(400, 'Image file is required');
  }

  if (!file.buffer) {
    throw new AppError(400, 'File buffer is missing');
  }

  const {secureUrl, publicId} = await uploadBannerImageToCloudinary(file.buffer, {folder: 'admin-banners'})
  if (!secureUrl || !publicId) {
    throw new AppError(500, 'Failed to upload image to Cloudinary');
  }

  const banner = await createAdminBanner(secureUrl, publicId)
  if (!banner) {
    throw new AppError(500, 'Failed to create banner');
  }

  return banner;
}