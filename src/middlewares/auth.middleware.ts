import type {Request, Response, NextFunction} from "express";
import {AppError} from "../errors/AppError.js";
import {verifyAccessToken} from "../lib/jwt.js";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const noTokenError = new AppError(401, "Access token is required")

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next(noTokenError);
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    next(noTokenError);
    return;
  }

  req.user = verifyAccessToken(token);
  next();
}