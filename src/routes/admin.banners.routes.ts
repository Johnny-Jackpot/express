import type {Request, Response} from "express";
import {Router} from "express";
import {authenticate} from "../middlewares/auth.middleware.js";
import {requireAdmin} from "../middlewares/admin.middleware.js";
import {created, ok} from "../lib/respond.js";
import {deleteAdminBanner, getAdminBanners, uploadAdminBanner} from "../services/admin.banner.service.js";
import {uploadSingleBannerImg} from "../middlewares/banner.middleware.js";
import {AppError} from "../errors/AppError.js";

export const adminBannerRoutes = Router();

adminBannerRoutes.use(authenticate, requireAdmin)

adminBannerRoutes.post("/", uploadSingleBannerImg, async (req: Request, res: Response): Promise<void> => {
  const banner = await uploadAdminBanner(req.file)
  created(res, {data: {banner}})
})

adminBannerRoutes.get("/", async (_req: Request, res: Response): Promise<void> => {
  const banners = await getAdminBanners()
  ok(res, {data: {banners}})
})

adminBannerRoutes.delete("/:bannerId", async (req: Request, res: Response): Promise<void> => {
  const {bannerId} = req.params;
  if (!bannerId || typeof bannerId !== 'string') {
    throw new AppError(400,"Banner ID is required");
  }

  await deleteAdminBanner(bannerId);

  ok(res, {message: 'Banner deleted successfully'})
})