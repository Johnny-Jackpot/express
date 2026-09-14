import type {Request, Response} from "express";
import {Router} from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Health route is working",
  })
});