import type {NextFunction,  Request,  Response} from "express";
import {Router} from "express";
import {authenticate} from "../middlewares/auth.middleware.js";
import {createUserTask, getUserTaskById, getUserTasks, updateUserTask} from "../services/user.task.service.js";
import {AppError} from "../errors/AppError.js";

export const userTaskRouter = Router();

userTaskRouter.use(authenticate);

userTaskRouter.post("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await createUserTask(req.user!.userId, req.body.title)

    res.status(201).json({
      success: true,
      data: {task}
    })
  } catch (error) {
    next(error)
  }
})

userTaskRouter.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tasks = await getUserTasks(req.user!.userId)

    res.status(200).json({
      success: true,
      data: {tasks}
    })
  } catch (error) {
    next(error)
  }
})

userTaskRouter.get("/:taskId", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {taskId} = req.params;
    if (!taskId || typeof taskId !== 'string') {
      next(new AppError(400,"Task ID is required"));
      return;
    }

    const task = await getUserTaskById(taskId, req.user!.userId)

    res.status(200).json({
      success: true,
      data: {task}
    })
  } catch (error) {
    next(error)
  }
})

userTaskRouter.patch("/:taskId", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {taskId} = req.params;
    if (!taskId || typeof taskId !== 'string') {
      next(new AppError(400,"Task ID is required"));
      return;
    }

    const task = await updateUserTask(
      taskId,
      req.user!.userId,
      req.body.title,
    )

    res.status(200).json({
      success: true,
      data: {task}
    })
  } catch (error) {
    next(error)
  }
})