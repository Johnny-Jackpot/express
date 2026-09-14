import type {Request, Response} from "express";
import {fail} from "../lib/respond.js";

export function notFound(_req: Request, res: Response): void {
  fail(res, 404, 'Route not found')
}