import { z } from 'zod';

export const registerSchema = z.object({

    name: z.string().trim().min(1).max(100),
    email: z.string().trim().toLowerCase().pipe(z.email()),
    gender: z.enum(['MALE', 'FEMALE']),
    password: z.string().min(8),
    confirmPassword: z.string(),

  }).refine((data) => data.password === data.confirmPassword, {

    path: ['confirmPassword'],
    message: 'Passwords do not match',

  });

export const loginSchema = z.object({

  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1),

});
