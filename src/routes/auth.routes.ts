import type {Request, Response} from "express";
import {Router} from "express"
import {loginUser, registerUser} from "../services/auth.service.js";
import {authenticate} from "../middlewares/auth.middleware.js";
import {created, ok} from "../lib/respond.js";

export const authRouter = Router()

authRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
  const {email, password} = req.body
  await registerUser(email, password)
  created(res, {message: 'Registration successful. Please login to continue.'})
})

authRouter.post('/login', async(req: Request, res: Response): Promise<void> => {
  const {email, password} = req.body
  const {accessToken} = await loginUser(email, password)
  ok(res, {data: {accessToken}})
})

authRouter.get("/me", authenticate, (req: Request, res: Response) => {
  ok(res, {data: {user: req.user}})
})