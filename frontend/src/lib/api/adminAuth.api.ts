import { apiClient } from '../apiClient';
import { User, AuthResponse } from '@/types/auth'; // Assuming a central types definition

export const adminAuthApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
  
  // You can add other admin-specific auth functions here later
  // e.g., forgotPassword, resetPassword, etc.
};
