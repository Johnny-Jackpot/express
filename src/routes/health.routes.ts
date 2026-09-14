import type {Request, Response} from "express";
import {Router} from 'express';
import {ok} from "../lib/respond.js";

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  ok(res, {message: "Health route is working"})
});