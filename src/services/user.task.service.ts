import type {Task} from "../types/task.js";
import {AppError} from "../errors/AppError.js";
import {createTask, deleteTask, fetchTasksByUserId, findTaskByIdAndUserId, updateTaskTitle} from "../repositories/user.task.repository.js";
import {getFromCacheOrFetch, invalidateCache} from "./cache.js";

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

const USER_TASKS_CACHE_TIME = 60 * 60; //1 hour
const getUserTasksCacheKey = (userId: string): string => `user_tasks:${userId}`;
const getUserTaskCacheKey = (taskId: string, userId: string): string => `user_task:${userId}:${taskId}`;

export async function createUserTask(userId: string, title: unknown): Promise<Task> {
  const validTitle = validateTitle(title);

  const task = await createTask(userId, validTitle);

  await invalidateCache(getUserTasksCacheKey(userId));

  return task;
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  const cacheKey = getUserTasksCacheKey(userId);
  return getFromCacheOrFetch<Task[]>({
    fetch: () => fetchTasksByUserId(userId),
    cacheKey,
    ttl: USER_TASKS_CACHE_TIME,
  });
}

export async function getUserTaskById(
  taskId: string,
  userId: string,
): Promise<Task> {
  const cacheKey = getUserTaskCacheKey(taskId, userId);
  const task = await getFromCacheOrFetch<Task|null>({
    fetch: () => findTaskByIdAndUserId(taskId, userId),
    cacheKey,
    ttl: USER_TASKS_CACHE_TIME,
  })
  if (!task) {
    throw new AppError(404, 'Task not found');
  }

  return task;
}

export async function updateUserTask(
  taskId: string,
  userId: string,
  title: string,
): Promise<Task> {
  const validTitle = validateTitle(title);
  const task = await updateTaskTitle(taskId, userId, validTitle);
  if (!task) {
    throw new AppError(404, 'Task not found');
  }

  await Promise.all([
    invalidateCache(getUserTasksCacheKey(userId)),
    invalidateCache(getUserTaskCacheKey(taskId, userId)),
  ])

  return task;
}

export async function deleteUserTask(taskId: string, userId: string): Promise<void> {
  const deleted = await deleteTask(taskId, userId)
  if (!deleted) {
    throw new AppError(404, 'Task not found');
  }

  await Promise.all([
    invalidateCache(getUserTasksCacheKey(userId)),
    invalidateCache(getUserTaskCacheKey(taskId, userId)),
  ])
}