import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  photoUrl: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type RegisterPayload = z.infer<typeof RegisterSchema>;
export type LoginPayload = z.infer<typeof LoginSchema>;
