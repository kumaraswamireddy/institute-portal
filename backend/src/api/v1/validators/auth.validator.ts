import { z } from 'zod';

const login = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().min(1, 'Password is required.'),
  }),
});

const googleSignIn = z.object({
  body: z.object({
    idToken: z.string().min(1, 'Google ID token is required.'),
  }),
});

const googleRegister = z.object({
  body: z.object({
    googleId: z.string().min(1, 'Google ID is required.'),
    email: z.string().email('A valid email is required.'),
    name: z.string().min(1, 'Name is required.'),
    profilePictureUrl: z.string().url().optional(),
    role: z.enum(['student', 'institute']),
    instituteName: z.string().optional(),
  }).refine(data => {
    if (data.role === 'institute') {
      return !!data.instituteName && data.instituteName.length > 0;
    }
    return true;
  }, {
    message: 'Institute name is required when role is institute.',
    path: ['instituteName'],
  }),
});

export const authValidator = {
  login,
  googleSignIn,
  googleRegister,
};

