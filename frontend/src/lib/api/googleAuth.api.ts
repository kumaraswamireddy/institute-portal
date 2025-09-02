import { apiClient } from '../apiClient';
import { GoogleSignInResponse, RegistrationResponse, RegistrationPayload } from '@/types/auth';

export const googleAuthApi = {
  signIn: async (idToken: string): Promise<GoogleSignInResponse> => {
    const response = await apiClient.post<GoogleSignInResponse>('/user/google-sign-in', {
      idToken,
    });
    return response.data;
  },
  
  register: async (payload: RegistrationPayload): Promise<RegistrationResponse> => {
    const response = await apiClient.post<RegistrationResponse>('/user/register', payload);
    return response.data;
  },
};
