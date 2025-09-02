import { z } from 'zod';
import { ResourceStatusEnum } from '../models/institute.model';

// Zod schema for creating a new institute
export const createInstituteSchema = z.object({
  body: z.object({
    inst_admin_user_id: z.string().uuid({ message: "Admin user ID must be a valid UUID" }),
    inst_name: z.string().min(3, { message: "Institute name must be at least 3 characters long" }).max(255),
    inst_description: z.string().optional(),
    inst_address: z.string().optional(),
    inst_city: z.string().optional(),
    inst_pincode: z.string().length(6, { message: "Pincode must be 6 digits" }).optional(),
    inst_latitude: z.number().min(-90).max(90).optional(),
    inst_longitude: z.number().min(-180).max(180).optional(),
    inst_plan_id: z.string().uuid({ message: "Plan ID must be a valid UUID" }).optional(),
  }),
});


// Zod schema for updating an institute
export const updateInstituteSchema = z.object({
  params: z.object({
    instituteId: z.string().uuid({ message: "Institute ID must be a valid UUID" }),
  }),
  body: z.object({
    inst_name: z.string().min(3).max(255).optional(),
    inst_description: z.string().optional(),
    inst_address: z.string().optional(),
    inst_city: z.string().optional(),
    inst_pincode: z.string().length(6).optional(),
    inst_latitude: z.number().min(-90).max(90).optional(),
    inst_longitude: z.number().min(-180).max(180).optional(),
    inst_status: z.nativeEnum(ResourceStatusEnum).optional(),
    inst_is_verified: z.boolean().optional(),
    inst_plan_id: z.string().uuid().optional(),
    inst_plan_end_date: z.string().datetime().optional(),
  }).partial(), // .partial() makes all fields in the body optional
});

