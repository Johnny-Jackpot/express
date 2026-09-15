import type {Banner} from "../types/banner.js";
import {AppError} from "../errors/AppError.js";
import {uploadBannerImageToCloudinary} from "../lib/cloudinary.js";
import {createAdminBanner, fetchAdminBanners} from "../repositories/admin.banner.repository.js";
import {getFromCacheOrFetch, invalidateCache} from "../lib/cache.js";

const CACHE_KEY = 'admin:banners';

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

  await invalidateCache(CACHE_KEY);

  return banner;
}

export async function getAdminBanners() {
  return getFromCacheOrFetch<Banner[]>({
    fetch: () => fetchAdminBanners(),
    cacheKey: CACHE_KEY
  })
}