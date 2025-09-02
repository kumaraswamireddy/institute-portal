import apiClient from '../apiClient';

interface GoogleRegisterPayload {
  googleId: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
  role: 'student' | 'institute';
  instituteName?: string;
}

/**
 * Sends the Google ID token to the backend to sign in or check for a new user.
 */
const signIn = (idToken: string) => {
  return apiClient.post('/auth/google/signin', { idToken });
};

/**
 * Sends the new user's profile data and chosen role to the backend to create an account.
 */
const register = (payload: GoogleRegisterPayload) => {
  return apiClient.post('/auth/google/register', payload);
};

export const googleAuthApi = {
  signIn,
  register,
};

