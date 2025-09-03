import { z } from 'zod';

// ... (login and googleSignIn schemas remain the same) ...
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
    // --- Data from Google ---
    email: z.string().email('A valid email is required.'),
    googleId: z.string().min(1, 'Google ID is required.'),
    profilePictureUrl: z.string().url('Must be a valid URL.').optional(),
    
    // --- Data from User Input ---
    role: z.enum(['student', 'institute']),
    fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
    
    // =================================================================
    // <<< THE DEFINITIVE FIX: PART 1 >>>
    // Mobile number is no longer optional. It is now a required string.
    // =================================================================
    mobileNo: z.string().min(10, 'A valid mobile number is required.').regex(/^\+?[1-9]\d{9,14}$/, 'Invalid mobile number format.'),
    
    instituteName: z.string().min(3, 'Institute name must be at least 3 characters.').optional(),

  }).refine(data => {
    // If the role is 'institute', then instituteName is required.
    if (data.role === 'institute') {
      return !!data.instituteName;
    }
    return true;
  }, {
    message: 'Institute name is required when registering as an institute.',
    path: ['instituteName'],
  }),
});

export const authValidator = {
  login,
  googleSignIn,
  googleRegister,
};

