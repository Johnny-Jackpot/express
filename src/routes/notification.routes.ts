import type {Request, Response} from "express";
import {Router} from 'express';
import {publishNotification} from "../subscribers/notifications.js";
import {created} from "../lib/respond.js";

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
  created(res, {data: {notification}, message: 'Notification published successfully'})
})