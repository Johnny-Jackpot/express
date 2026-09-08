import type {Task} from "../types/task.js";
import {AppError} from "../errors/AppError.js";
import {createTask, fetchTasksByUserId, findTaskByIdAndUserId} from "../repositories/user.task.repository.js";

function validateTitle(title: unknown): string {
  if (typeof title !== 'string' || !title.trim()) {
    throw new AppError(400, 'Title is required');
  }

  const trimmedTitle = title.trim();

  const maxTitleLength = 100;
  if (trimmedTitle.length > maxTitleLength) {
    throw new AppError(400, `Title must be ${maxTitleLength} characters or less`);
  }

  return trimmedTitle;
}

export async function createUserTask(userId: string, title: unknown): Promise<Task> {
  const validTitle = validateTitle(title);

  return createTask(userId, validTitle);
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  return fetchTasksByUserId(userId)
}

export async function getUserTaskById(
  taskId: string,
  userId: string,
): Promise<Task> {
  const task = await findTaskByIdAndUserId(taskId, userId);
  if (!task) {
    throw new AppError(404, 'Task not found');
  }

  return task;
}