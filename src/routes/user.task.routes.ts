import type {Request, Response} from "express";
import {Router} from 'express';
import {authenticate} from "../middlewares/auth.middleware.js";
import {createUserTask, deleteUserTask, getUserTaskById, getUserTasks, updateUserTask} from "../services/user.task.service.js";
import {AppError} from "../errors/AppError.js";
import {userTaskRateLimiter} from "../middlewares/rateLimit.middleware.js";
import {created, ok} from "../lib/respond.js";

export const userTaskRouter = Router();

userTaskRouter.use(authenticate, userTaskRateLimiter);

userTaskRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  const task = await createUserTask(req.user!.userId, req.body.title)
  created(res, {data: {task}})
})

userTaskRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  const tasks = await getUserTasks(req.user!.userId)
  ok(res, {data: {tasks}})
})

userTaskRouter.get("/:taskId", async (req: Request, res: Response): Promise<void> => {
  const {taskId} = req.params;
  if (!taskId || typeof taskId !== 'string') {
    throw new AppError(400,"Task ID is required");
  }

  const task = await getUserTaskById(taskId, req.user!.userId)
  ok(res, {data: {task}})
})

userTaskRouter.patch("/:taskId", async (req: Request, res: Response): Promise<void> => {
  const {taskId} = req.params;
  if (!taskId || typeof taskId !== 'string') {
    throw new AppError(400,"Task ID is required");
  }

  const task = await updateUserTask(taskId, req.user!.userId, req.body.title)
  ok(res, {data: {task}})
})

userTaskRouter.delete("/:taskId", async (req: Request, res: Response): Promise<void> => {
  const {taskId} = req.params;
  if (!taskId || typeof taskId !== 'string') {
    throw new AppError(400,"Task ID is required");
  }

  await deleteUserTask(taskId, req.user!.userId)
  ok(res, {message: 'Task deleted successfully'})
})