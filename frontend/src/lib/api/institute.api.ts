import { Institute } from '../../../../backend/src/api/v1/models/institute.model'; // Assuming type path
import { apiClient } from '../apiClient';

/**
 * Fetches all institutes with optional search and filter queries.
 * @param {URLSearchParams} query - The URL search parameters.
 * @returns {Promise<Institute[]>} A promise that resolves to an array of institutes.
 */
const getAll = (query: URLSearchParams = new URLSearchParams()): Promise<Institute[]> => {
    return apiClient<Institute[]>(`/institutes?${query.toString()}`);
};

/**
 * Deletes an institute by its unique ID.
 * @param {string} instituteId - The ID of the institute to delete.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const remove = (instituteId: string): Promise<void> => {
    return apiClient<void>(`/institutes/${instituteId}`, { method: 'DELETE' });
};

// --- Future functions for this module ---
// const create = (data: CreateInstituteDto) => apiClient('/institutes', { method: 'POST', body: JSON.stringify(data) });
// const update = (id: string, data: UpdateInstituteDto) => apiClient(`/institutes/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
// const getById = (id: string) => apiClient<Institute>(`/institutes/${id}`);


// Export all functions as a single object
export const instituteApi = {
    getAll,
    remove,
    // create,
    // update,
    // getById,
};
