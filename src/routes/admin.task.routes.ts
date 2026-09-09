import {type NextFunction, type Request, type Response, Router} from "express";
import {authenticate} from "../middlewares/auth.middleware.js";
import {requireAdmin} from "../middlewares/admin.middleware.js";
import {getAdminTasks} from "../services/admin.task.service.js";

export const adminTaskRoutes = Router();

adminTaskRoutes.use(authenticate, requireAdmin)

adminTaskRoutes.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tasks = await getAdminTasks(req.query)

    res.status(200).json({
      success: true,
      data: {tasks}
    })
  } catch (error) {
    next(error)
  }
})