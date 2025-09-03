import { Request, Response } from 'express';
import { googleAuthService } from '../services/googleAuth.service';
import { catchAsync } from '../../../utils/catchAsync';
import httpStatus from 'http-status';
import ApiResponse from '../../../utils/ApiResponse';

const googleSignIn = catchAsync(async (req: Request, res: Response) => {
    const { idToken } = req.body;
    const result = await googleAuthService.handleGoogleSignIn(idToken);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, result, 'Authentication check successful'));
});

const register = catchAsync(async (req: Request, res: Response) => {
    // Destructure all fields from the request body
    const { email, googleId, profilePictureUrl, role, fullName, mobileNo, instituteName } = req.body;
    
    // Call the service with the new, complete set of arguments
    const result = await googleAuthService.registerNewUser(
        email, 
        googleId, 
        profilePictureUrl, 
        role, 
        fullName, 
        mobileNo, 
        instituteName
    );
    
    res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, result, 'User registered successfully'));
});

export const googleAuthController = {
    googleSignIn,
    register,
};

