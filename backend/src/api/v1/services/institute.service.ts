import { Institute, ResourceStatusEnum } from '../models/institute.model';
import { User } from '../models/user.model';
import { Event } from '../models/engagement.model'; // Import Event model
import { ApiError } from '../../../../utils/ApiError';
import httpStatus from 'http-status';

// --- MOCK DATABASE ---
// In a real application, this data would come from a database like PostgreSQL.
const institutes: (Institute & { owner?: User })[] = [
    { inst_institute_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', inst_admin_user_id: 'u1', inst_name: 'Innovate Tech Academy', inst_city: 'Bangalore', inst_status: ResourceStatusEnum.ACTIVE, inst_is_verified: true, inst_created_at: new Date('2023-01-10'), owner: { usr_full_name: 'Rohan Verma' } as User },
    { inst_institute_id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', inst_admin_user_id: 'u2', inst_name: 'Future Skills Institute', inst_city: 'Pune', inst_status: ResourceStatusEnum.PENDING_APPROVAL, inst_is_verified: false, inst_created_at: new Date('2023-02-15'), owner: { usr_full_name: 'Priya Mehta' } as User },
];
const events: Event[] = [
    { evnt_event_id: 'evt1', evnt_institute_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', evnt_title: 'Free Java Demo Class', evnt_type: 'online' as any, evnt_datetime: new Date('2025-09-15T11:00:00Z'), evnt_created_at: new Date() }
];
// --- END MOCK DATABASE ---

export type CreateInstituteInput = Omit<Institute, 'inst_institute_id' | 'inst_status' | 'inst_is_verified' | 'inst_created_at'>;
export type UpdateInstituteInput = Partial<Omit<Institute, 'inst_institute_id' | 'inst_admin_user_id' | 'inst_created_at'>>;

// Define a more complex query type for advanced search
export interface InstituteQuery {
    search?: string;
    status?: ResourceStatusEnum;
    city?: string;
    rating?: number;
    hasDemos?: boolean;
}

class InstituteService {
    // ... existing createInstitute, getInstituteById, updateInstitute, deleteInstitute methods ...

    /**
     * Get all institutes with advanced filtering.
     * @param {InstituteQuery} query - Query parameters for filtering.
     * @returns {Promise<Institute[]>} A list of institutes.
     */
    async getAllInstitutes(query: InstituteQuery): Promise<Institute[]> {
        console.log('Fetching all institutes with advanced query:', query);
        // In a real implementation, this would be a complex SQL query with JOINs.
        let results = [...institutes];

        if (query.search) {
            const searchTerm = query.search.toLowerCase();
            results = results.filter(inst => inst.inst_name.toLowerCase().includes(searchTerm));
        }
        if (query.status) {
            results = results.filter(inst => inst.inst_status === query.status);
        }
        if (query.city) {
            results = results.filter(inst => inst.inst_city?.toLowerCase() === query.city?.toLowerCase());
        }
        // Mock filtering by demos
        if (query.hasDemos) {
            const institutesWithDemos = new Set(events.map(e => e.evnt_institute_id));
            results = results.filter(inst => institutesWithDemos.has(inst.inst_institute_id));
        }
        // Mock filtering by rating would require a JOIN with the reviews table.

        return results;
    }

    /**
     * [NEW] Update the verification status of an institute.
     * @param {string} instituteId - The ID of the institute.
     * @param {boolean} isVerified - The new verification status.
     * @returns {Promise<Institute>} The updated institute.
     */
    async updateVerificationStatus(instituteId: string, isVerified: boolean): Promise<Institute> {
        console.log(`Updating verification status for institute ${instituteId} to ${isVerified}`);
        const institute = await this.getInstituteById(instituteId);
        institute.inst_is_verified = isVerified;
        // In a real app, you would save the changes to the database here.
        return institute;
    }

    /**
     * [NEW] Assign a subscription plan to an institute.
     * @param {string} instituteId - The ID of the institute.
     * @param {string} planId - The ID of the subscription plan.
     * @param {Date} endDate - The end date of the subscription.
     * @returns {Promise<Institute>} The updated institute.
     */
    async assignSubscriptionPlan(instituteId: string, planId: string, endDate: Date): Promise<Institute> {
        console.log(`Assigning plan ${planId} to institute ${instituteId}`);
        const institute = await this.getInstituteById(instituteId);
        institute.inst_plan_id = planId;
        institute.inst_plan_end_date = endDate;
        return institute;
    }

    /**
     * [NEW] Get all events for a specific institute.
     * @param {string} instituteId - The ID of the institute.
     * @returns {Promise<Event[]>} A list of events.
     */
    async getEventsByInstitute(instituteId: string): Promise<Event[]> {
        console.log(`Fetching events for institute ${instituteId}`);
        // This is a mock implementation. A real one would query the 'events' table.
        const instituteEvents = events.filter(event => event.evnt_institute_id === instituteId);
        return instituteEvents;
    }

    // --- Placeholder for original methods from previous step ---
    async createInstitute(instituteData: CreateInstituteInput): Promise<Institute> {
        const newInstitute: Institute = { inst_institute_id: `inst_${Date.now()}`, ...instituteData, inst_status: ResourceStatusEnum.PENDING_APPROVAL, inst_is_verified: false, inst_created_at: new Date() };
        institutes.push(newInstitute);
        return newInstitute;
    }
    async getInstituteById(instituteId: string): Promise<Institute> {
        const institute = institutes.find(inst => inst.inst_institute_id === instituteId);
        if (!institute) throw new ApiError(httpStatus.NOT_FOUND, 'Institute not found');
        return institute;
    }
    async updateInstitute(instituteId: string, updateData: UpdateInstituteInput): Promise<Institute> {
        const instituteIndex = institutes.findIndex(inst => inst.inst_institute_id === instituteId);
        if (instituteIndex === -1) throw new ApiError(httpStatus.NOT_FOUND, 'Institute not found');
        institutes[instituteIndex] = { ...institutes[instituteIndex], ...updateData };
        return institutes[instituteIndex];
    }
    async deleteInstitute(instituteId: string): Promise<void> {
        const instituteIndex = institutes.findIndex(inst => inst.inst_institute_id === instituteId);
        if (instituteIndex === -1) throw new ApiError(httpStatus.NOT_FOUND, 'Institute not found');
        institutes.splice(instituteIndex, 1);
    }
}

export const instituteService = new InstituteService();

