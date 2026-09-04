import { Router } from "express"
import {registerUser} from "../services/auth.service.js";

export const authRouter = Router()

authRouter.post('/register', async (req, res, next) => {
  try {
    const {email, password} = req.body

    await registerUser(email, password)

    res.status(201).json({
      success: true,
      message: 'Registration successfull. Please login to continue.'
    })
  } catch (error) {
    next(error)
  }
})