import type {Request, Response} from "express";
import {Router} from "express";
import {authenticate} from "../middlewares/auth.middleware.js";
import {requireAdmin} from "../middlewares/admin.middleware.js";
import {adminTaskRoutes} from "./admin.task.routes.js";
import {created} from "../lib/respond.js";
import {uploadAdminBanner} from "../services/admin.banner.service.js";
import {uploadSingleBannerImg} from "../middlewares/banner.middleware.js";

export const adminBannerRoutes = Router();

adminTaskRoutes.use(authenticate, requireAdmin)

adminBannerRoutes.post("/", uploadSingleBannerImg, async (req: Request, res: Response): Promise<void> => {
  const banner = await uploadAdminBanner(req.file)
  created(res, {data: {banner}})
})