import type {Response} from "express";

type SuccessPayload<T> = {
  data?: T;
  message?: string;
};

export function ok<T>(res: Response, payload: SuccessPayload<T> = {}, status = 200): void {
  res.status(status).json({
    success: true,
    ...(payload.message !== undefined && {message: payload.message}),
    ...(payload.data !== undefined && {data: payload.data}),
  });
}

export function created<T>(res: Response, payload: SuccessPayload<T> = {}): void {
  ok(res, payload, 201);
}

export function noContent(res: Response): void {
  res.status(204).end();
}

export function fail(res: Response, status: number, message: string): void {
  res.status(status).json({success: false, message});
}

export function notFound(_req: Request, res: Response): void {
  fail(res, 404, 'Route not found');
}