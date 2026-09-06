import type {DBUserRow, DBUserWithPasswordRow, User} from "../types/user.js";
import {pool} from "../lib/db.js";
import {AppError} from "../errors/AppError.js";

export async function findUserByEmail(email: string): Promise<User|null> {
  const result = await pool.query<DBUserRow>(
    "SELECT id, email, role, created_at FROM users WHERE email = $1",
    [email]
  );

  const row = result.rows[0];

  return row ? (row as User) : null;
}

export async function createUser(email: string, passwordHash: string): Promise<User> {
  const result = await pool.query<DBUserRow>(`
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, role, created_at`,
    [email, passwordHash]
  );

  const user = result.rows[0];
  if (!user) {
    throw new AppError(500, "User not created");
  }

  return user as User;
}

export async function findUserByEmailWithPassword(
  email: string
): Promise<DBUserWithPasswordRow|null> {
  const result = await pool.query<DBUserWithPasswordRow>(
    `SELECT id, email, role, password_hash, created_at
    FROM users WHERE email = $1`, [email]
  )

  return result.rows[0] ?? null
}