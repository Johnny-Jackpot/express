import type {Request, Response, NextFunction} from "express";
import {logger} from "../lib/logger.js";
import {redis} from "../lib/redis.js";

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 5;

export async function userTaskRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ip = req.ip || 'unknown';
    const rateLimitKey = `rate_limit:user_tasks:${ip}`;
    const requestCount = await redis.incr(rateLimitKey);
    if (requestCount === 1) {
      await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW_SECONDS);
    }

    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX_REQUESTS - requestCount).toString());

    if (requestCount > RATE_LIMIT_MAX_REQUESTS) {
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later.'
      });
      return;
    }

    next();
  } catch (err) {
    logger.error({err}, "rate limit redis error");
    next(err);
  }
}