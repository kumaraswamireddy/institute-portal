import { z } from 'zod';
import { EventTypeEnum } from '../models/engagement.model';

// Zod schema for creating a new event
export const createEventSchema = z.object({
  body: z.object({
    evnt_institute_id: z.string().uuid({ message: "Institute ID must be a valid UUID" }),
    evnt_title: z.string().min(5, { message: "Event title must be at least 5 characters" }).max(255),
    evnt_type: z.nativeEnum(EventTypeEnum, { errorMap: () => ({ message: "Event type must be 'online' or 'offline'" }) }),
    evnt_datetime: z.string().datetime({ message: "Event datetime must be a valid ISO 8601 date string" }),
    evnt_details: z.string().optional(),
  }),
});

// Zod schema for updating an event
export const updateEventSchema = z.object({
  params: z.object({
    eventId: z.string().uuid({ message: "Event ID must be a valid UUID" }),
  }),
  body: z.object({
    evnt_title: z.string().min(5).max(255).optional(),
    evnt_type: z.nativeEnum(EventTypeEnum).optional(),
    evnt_datetime: z.string().datetime().optional(),
    evnt_details: z.string().optional(),
  }).partial(),
});
