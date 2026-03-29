import { z } from 'zod';

export type UpdateProfilePayload = z.infer<typeof UpdateProfileSchema>;

export const UpdateProfileSchema = z.object({
  phone: z.string().optional(),
  photoUrl: z.string().optional(),
  password: z.string().min(6).optional(),
  name: z.string().optional(),
  role: z.string().optional(),
});
