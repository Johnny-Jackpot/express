import type {Request, Response, NextFunction} from "express";
import {logger} from "../lib/logger.js";
import {AppError} from "../errors/AppError.js";
import {fail} from "../lib/respond.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    fail(res, err.statusCode, err.message);
    return
  }

  logger.error({err}, "Unhandled error");
  fail(res, 500, 'Internal server error');
}