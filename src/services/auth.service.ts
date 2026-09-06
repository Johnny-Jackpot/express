import {AppError} from "../errors/AppError.js";
import {createUser, findUserByEmail, findUserByEmailWithPassword} from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";
import {signAccessToken} from "../lib/jwt.js";

export async function registerUser(
  email: string,
  password: string,
): Promise<void> {
  if (!email || !password) {
    throw new AppError(400,'Email and password are required');
  }

  if (password.length < 6) {
    throw new AppError(400,'Password must be at least 6 characters long');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new AppError(400,'User already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await createUser(normalizedEmail, passwordHash);
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{accessToken: string}> {
  if (!email || !password) {
    throw new AppError(400,'Email and password are required');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await findUserByEmailWithPassword(normalizedEmail)

  if (!user?.password_hash) {
    throw new AppError(401, "Invalid email or password")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash)
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password")
  }

  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  return {accessToken};
}