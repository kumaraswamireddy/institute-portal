import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { instituteService, InstituteQuery } from '../services/institute.service';
import { ApiError } from '../../../../utils/ApiError';
import { ApiResponse } from '../../../../utils/ApiResponse';

// A utility for handling async functions and catching errors
const catchAsync = (fn: (req: Request, res: Response) => Promise<void>) => 
  (req: Request, res: Response, next: (err?: any) => void) => {
    Promise.resolve(fn(req, res)).catch((err) => next(err));
};

class InstituteController {
    /**
     * @desc      Create a new institute
     * @route     POST /api/v1/institutes
     * @access    Private (Admin)
     */
    createInstitute = catchAsync(async (req: Request, res: Response) => {
        const institute = await instituteService.createInstitute(req.body);
        res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, 'Institute created successfully', institute));
    });

    /**
     * @desc      Get all institutes with filtering
     * @route     GET /api/v1/institutes
     * @access    Public
     */
    getAllInstitutes = catchAsync(async (req: Request, res: Response) => {
        // The query parameters are validated by the instituteSearchSchema
        const query: InstituteQuery = req.query;
        const institutes = await instituteService.getAllInstitutes(query);
        res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, 'Institutes retrieved successfully', institutes));
    });

    /**
     * @desc      Get a single institute by ID
     * @route     GET /api/v1/institutes/:instituteId
     * @access    Public
     */
    getInstituteById = catchAsync(async (req: Request, res: Response) => {
        const institute = await instituteService.getInstituteById(req.params.instituteId);
        if (!institute) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Institute not found');
        }
        res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, 'Institute retrieved successfully', institute));
    });

    /**
     * @desc      Update an institute
     * @route     PATCH /api/v1/institutes/:instituteId
     * @access    Private (Admin)
     */
    updateInstitute = catchAsync(async (req: Request, res: Response) => {
        const updatedInstitute = await instituteService.updateInstitute(req.params.instituteId, req.body);
        res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, 'Institute updated successfully', updatedInstitute));
    });

    /**
     * @desc      Delete an institute
     * @route     DELETE /api/v1/institutes/:instituteId
     * @access    Private (Super Admin)
     */
    deleteInstitute = catchAsync(async (req: Request, res: Response) => {
        await instituteService.deleteInstitute(req.params.instituteId);
        res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, 'Institute deleted successfully'));
    });
}

export const instituteController = new InstituteController();
