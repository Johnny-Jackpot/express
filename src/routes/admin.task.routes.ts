import type {Request, Response} from "express";
import {Router} from "express";
import {authenticate} from "../middlewares/auth.middleware.js";
import {requireAdmin} from "../middlewares/admin.middleware.js";
import {getAdminTasks, updateAdminTaskStatus} from "../services/admin.task.service.js";
import {AppError} from "../errors/AppError.js";
import {ok} from "../lib/respond.js";

export const adminTaskRoutes = Router();

adminTaskRoutes.use(authenticate, requireAdmin)

adminTaskRoutes.get("/", async (req: Request, res: Response): Promise<void> => {
  const tasks = await getAdminTasks(req.query)
  ok(res, {data: {tasks}})
})

adminTaskRoutes.patch("/:taskId/status", async (req: Request, res: Response): Promise<void> => {
  const {taskId} = req.params;
  if (!taskId || typeof taskId !== 'string') {
    throw new AppError(400,"Task ID is required");
  }

  const task = await updateAdminTaskStatus(taskId, req.body.status)
  ok(res, {data: {task}})
})