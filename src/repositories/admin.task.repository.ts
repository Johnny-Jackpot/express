import type {Task} from "../types/task.js";
import {pool} from "../lib/db.js";

type TaskRow = Task;
type AdminTaskListFilters = {
  search?: string|undefined;
  status?: string|undefined;
};

export async function findAllTasks(filters: AdminTaskListFilters): Promise<Task[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  let paramIndex = 1;

  if (filters.search) {
    conditions.push(`title ILIKE $${paramIndex}`);
    values.push(`%${filters.search}%`);
    paramIndex++;
  }

  if (filters.status) {
    conditions.push(`status = $${paramIndex}`);
    values.push(filters.status);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await pool.query<TaskRow>(`
    SELECT id, title, status, user_id, created_at, updated_at 
    FROM support_tasks ${whereClause}
    ORDER BY created_at DESC
  `, values)

  return result.rows;
}