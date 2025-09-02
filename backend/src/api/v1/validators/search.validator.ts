import { z } from 'zod';
import { ResourceStatusEnum } from '../models/institute.model';

// Zod schema for validating institute search query parameters
export const instituteSearchSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.nativeEnum(ResourceStatusEnum).optional(),
    city: z.string().optional(),
    // Coerce string from query param to number
    rating: z.preprocess((val) => Number(val), z.number().min(1).max(5)).optional(),
    // Coerce string 'true'/'false' to boolean
    hasDemos: z.preprocess((val) => val === 'true', z.boolean()).optional(),
    page: z.preprocess((val) => Number(val), z.number().int().min(1)).optional().default(1),
    limit: z.preprocess((val) => Number(val), z.number().int().min(1).max(100)).optional().default(10),
  }),
});
