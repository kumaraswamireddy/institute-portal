import apiClient from "../apiClient"; // Corrected: Use default import

const login = (email: string, password: string) => {
    return apiClient.post('/auth/login', { email, password });
};

export const adminAuthApi = {
    login,
};
