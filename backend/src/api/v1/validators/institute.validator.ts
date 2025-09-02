import { z } from 'zod';

const createInstitute = z.object({
  body: z.object({
    name: z.string().min(3, 'Institute name must be at least 3 characters long.'),
    description: z.string().optional(),
    address: z.string().min(10, 'Address is required and must be detailed.'),
    city: z.string().min(2, 'City is required.'),
    state: z.string().min(2, 'State is required.'),
    zipCode: z.string().regex(/^\d{5,6}$/, 'Invalid zip code format.'),
    country: z.string().min(2, 'Country is required.'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format.').optional(),
    email: z.string().email('Invalid email address.').optional(),
    website: z.string().url('Invalid URL.').optional(),
  }),
});

const updateInstitute = z.object({
  params: z.object({
    id: z.string().uuid('Invalid institute ID.'),
  }),
  body: z.object({
    name: z.string().min(3, 'Institute name must be at least 3 characters long.').optional(),
    description: z.string().optional(),
    address: z.string().min(10, 'Address must be detailed.').optional(),
    city: z.string().min(2, 'City is required.').optional(),
    state: z.string().min(2, 'State is required.').optional(),
    zipCode: z.string().regex(/^\d{5,6}$/, 'Invalid zip code format.').optional(),
    country: z.string().min(2, 'Country is required.').optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format.').optional(),
    email: z.string().email('Invalid email address.').optional(),
    website: z.string().url('Invalid URL.').optional(),
    status: z.enum(['pending_approval', 'active', 'disabled']).optional(),
  }),
});

export const instituteValidator = {
  createInstitute,
  updateInstitute,
};
