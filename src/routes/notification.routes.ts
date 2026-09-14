import type {Request, Response} from "express";
import {Router} from 'express';
import {publishNotification} from "../subscribers/notifications.js";

export const notificationsRouter = Router();

notificationsRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  const {title, message} = req.body;
  const notification = {
    id: Date.now().toString(),
    title,
    message,
    createdAt: new Date().toISOString(),
  }

  await publishNotification(notification);

  res.status(201).json({
    success: true,
    message: 'Notification published successfully',
    data: {notification}
  })
})