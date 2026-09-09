import type {Task} from "../types/task.js";
import {AppError} from "../errors/AppError.js";
import {findAllTasks} from "../repositories/admin.task.repository.js";

type AdminTaskListQuery = {
  search?: string;
  status?: string;
};

type AdminTaskListResponse = {
  tasks: Task[];
};

const TASK_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED'] as const;

type TaskStatus = typeof TASK_STATUSES[number];

export async function getAdminTasks(
  query: AdminTaskListQuery,
): Promise<AdminTaskListResponse> {
  const search = query.search?.trim() || undefined;
  const status = query.status?.trim() || undefined;

  if (status && !TASK_STATUSES.includes(status as TaskStatus)) {
    throw new AppError(400,`Status must be one of: ${TASK_STATUSES.join(', ')}`);
  }

  const tasks = await findAllTasks({search, status});

  return {tasks};
}