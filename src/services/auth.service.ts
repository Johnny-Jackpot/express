import {AppError} from "../errors/AppError.js";
import {createUser, findUserByEmail} from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";

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