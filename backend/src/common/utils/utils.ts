import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

export function validatePayload<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestException(
        error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      );
    }
    throw error;
  }
}
