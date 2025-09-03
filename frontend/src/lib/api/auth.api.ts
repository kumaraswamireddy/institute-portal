import apiClient from "../apiClient"; // Corrected: Use '../' to go up one directory

/**
 * Fetches the profile of the currently authenticated user.
 * This is used to validate the session on application load.
 */
const getMe = () => {
    return apiClient.get('/auth/me');
};

export const authApi = {
    getMe,
};

