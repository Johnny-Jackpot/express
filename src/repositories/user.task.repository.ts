import type {Task} from "../types/task.js";
import {pool} from "../lib/db.js";
import {AppError} from "../errors/AppError.js";

type TaskRow = Task

export async function createTask(
  userId: string,
  title: string,
): Promise<TaskRow> {
  const result = await pool.query<TaskRow>(`
    INSERT INTO support_tasks (title, user_id)
    VALUES ($1, $2)
    RETURNING id, title, status, user_id, created_at, updated_at
  `, [title, userId])

  const task = result.rows[0];
  if (!task) {
    throw new AppError(500, "Failed to create task");
  }

  return task;
}

export async function fetchTasksByUserId(userId: string): Promise<TaskRow[]> {
  const result = await pool.query<TaskRow>(`
    SELECT id, title, status, user_id, created_at, updated_at 
    FROM support_tasks
    WHERE user_id = $1
    ORDER BY created_at DESC
  `, [userId])

  return result.rows;
}

export async function findTaskByIdAndUserId(taskId: string, userId: string): Promise<TaskRow|null> {
  const result = await pool.query<TaskRow>(`
    SELECT id, title, status, user_id, created_at, updated_at 
    FROM support_tasks
    WHERE id = $1 AND user_id = $2
  `, [taskId, userId])

  return result.rows[0] ?? null;
}

export async function updateTaskTitle(
  taskId: string,
  userId: string,
  title: string,
): Promise<TaskRow|null> {
  const result = await pool.query<TaskRow>(`
    UPDATE support_tasks SET title = $1, updated_at = NOW()
    WHERE id = $2 AND user_id = $3
    RETURNING id, title, status, user_id, created_at, updated_at
  `, [title, taskId, userId]);

  return result.rows[0] ?? null;
}