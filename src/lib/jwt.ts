import type {TokenPayload} from "../types/user.js";
import jwt, {type SignOptions} from "jsonwebtoken";
import {env} from "../config/env.js";

export function signAccessToken(payload: TokenPayload): string {
  const options: SignOptions = {}

  const expiresIn = env.jwtAccessExpiresIn as SignOptions['expiresIn'];
  if (expiresIn !== undefined) {
    options.expiresIn = expiresIn;
  }

  return jwt.sign(payload, env.jwtAccessSecret, options);
}