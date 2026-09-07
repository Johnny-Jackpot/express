import type {TokenPayload} from "../types/user.js";
import jwt, {type SignOptions} from "jsonwebtoken";
import {env} from "../config/env.js";
import {AppError} from "../errors/AppError.js";

export function signAccessToken(payload: TokenPayload): string {
  const options: SignOptions = {}

  const expiresIn = env.jwtAccessExpiresIn as SignOptions['expiresIn'];
  if (expiresIn !== undefined) {
    options.expiresIn = expiresIn;
  }

  return jwt.sign(payload, env.jwtAccessSecret, options);
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.jwtAccessSecret) as TokenPayload;
  } catch (error) {
    throw new AppError(401,'Invalid access token');
  }
}