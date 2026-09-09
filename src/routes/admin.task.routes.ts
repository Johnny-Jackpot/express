import {type NextFunction, type Request, type Response, Router} from "express";
import {authenticate} from "../middlewares/auth.middleware.js";
import {requireAdmin} from "../middlewares/admin.middleware.js";
import {getAdminTasks, updateAdminTaskStatus} from "../services/admin.task.service.js";
import {AppError} from "../errors/AppError.js";

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

adminTaskRoutes.patch("/:taskId/status", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {taskId} = req.params;
    if (!taskId || typeof taskId !== 'string') {
      next(new AppError(400,"Task ID is required"));
      return;
    }

    const task = await updateAdminTaskStatus(taskId, req.body.status)

    res.status(200).json({
      success: true,
      data: {task}
    })
  } catch (error) {
    next(error)
  }
})