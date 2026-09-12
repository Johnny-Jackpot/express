import dotenv from 'dotenv';

dotenv.config();

function getRequiredEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env var ${key}`);
  }

  return value;
}

export const env = {
  port: Number(process.env["PORT"] ?? 3000),
  isProduction: (process.env["NODE_ENV"] ?? 'development') === 'production',
  nodeEnv: process.env["NODE_ENV"] ?? 'development',
  logLevel: process.env["LOG_LEVEL"] ?? 'info',
  databaseUrl: getRequiredEnvVariable('DATABASE_URL'),
  jwtAccessSecret: getRequiredEnvVariable('JWT_SECRET'),
  jwtAccessExpiresIn: getRequiredEnvVariable('JWT_ACCESS_EXPIRES_IN'),
  redisUrl: getRequiredEnvVariable("REDIS_URL"),
} as const;

