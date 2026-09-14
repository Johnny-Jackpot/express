import type {Banner} from "../types/banner.js";
import {pool} from "../lib/db.js";

type BannerRow = Banner

export async function createAdminBanner(
  imageUrl: string,
  cloudinaryPublicId: string,
): Promise<Banner|null> {
  const result = await pool.query<BannerRow>(`
    INSERT INTO banner (image_url, cloudinary_public_id)
    VALUES ($1, $2)
    RETURNING id, image_url, cloudinary_public_id, created_at, updated_at
  `, [imageUrl, cloudinaryPublicId])

  return result.rows[0] ?? null;
}