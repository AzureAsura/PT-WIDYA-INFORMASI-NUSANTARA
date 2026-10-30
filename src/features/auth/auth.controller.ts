import type { RequestHandler } from 'express';
import { z } from 'zod';
import * as authService from './auth.service.js';
import { loginSchema, registerSchema } from './auth.validator.js';

export const register: RequestHandler = async (req, res) => {
  
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: z.flattenError(result.error).fieldErrors,
    });
    return;
  }

  const { name, email, gender, password } = result.data;

  const user = await authService.register({ name, email, gender, password });

  if (!user) {
    res.status(409).json({ message: 'Email already registered' });
    return;
  }

  res.status(201).json({ 
    message: 'User registered', 
    data: user
  });

};

export const login: RequestHandler = async (req, res) => {

  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: z.flattenError(result.error).fieldErrors,
    });
    return;
  }

  const accessToken = await authService.login(result.data);

  if (!accessToken) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  res.status(200).json({
    message: 'Login successful',
    accessToken
  });

};
