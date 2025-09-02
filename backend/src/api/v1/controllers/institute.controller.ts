import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../utils/catchAsync';
import ApiError from '../../../utils/ApiError'; // Corrected path and import type
import ApiResponse from '../../../utils/ApiResponse'; // Corrected path and import type
import { pool } from '../../../config/database';

const getAllInstitutes = catchAsync(async (req: Request, res: Response) => {
  // TODO: Implement logic to fetch all approved institutes with pagination
  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, [], 'Institutes fetched successfully.'));
});

const getInstituteById = catchAsync(async (req: Request, res: Response) => {
  // TODO: Implement logic to fetch a single institute by its ID
  const { id } = req.params;
  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { id }, 'Institute details fetched successfully.'));
});

const createInstitute = catchAsync(async (req: Request, res: Response) => {
  // TODO: Implement logic for an authenticated institute owner to create their institute profile
  const instituteData = req.body;
  res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, instituteData, 'Institute created successfully.'));
});

const updateInstitute = catchAsync(async (req: Request, res: Response) => {
  // TODO: Implement logic for an authenticated institute owner to update their institute profile
  const { id } = req.params;
  const updateData = req.body;
  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { id, ...updateData }, 'Institute updated successfully.'));
});

export const instituteController = {
  getAllInstitutes,
  getInstituteById,
  createInstitute,
  updateInstitute,
};
