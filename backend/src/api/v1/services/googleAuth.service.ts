// ... (imports and other functions remain the same) ...
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { pool } from '../../../config/database';
import ApiError from '../../../utils/ApiError';
import httpStatus from 'http-status';
import logger from '../../../utils/logger';
const JWT_SECRET = process.env.JWT_SECRET!;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken: string) => {
  try {
    const ticket: LoginTicket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Google token: No payload found.');
    }
    return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || 'User',
        profilePictureUrl: payload.picture, 
    };
  } catch (error) {
    logger.error('Google token verification failed:', error);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Google token verification failed.');
  }
};

const generateAppToken = (payload: { id: string; role: 'student' | 'institute_owner' | 'super_admin' | 'moderator' }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};
const handleGoogleSignIn = async (idToken: string) => {
    const googleProfile = await verifyGoogleToken(idToken);
    let userResult = await pool.query('SELECT * FROM students WHERE stu_google_id = $1 OR stu_email = $2', [googleProfile.googleId, googleProfile.email]);
    if (userResult.rows.length > 0) {
        const student = userResult.rows[0];
        // =================================================================
        // <<< THE RESTORED LOGIC >>>
        // This constructs a standardized user object to match the frontend's expectations.
        // =================================================================
        const userForFrontend = {
            id: student.stu_student_id,
            name: student.stu_full_name,
            email: student.stu_email,
            role: 'student' as const,
            profilePictureUrl: student.stu_profile_picture_url,
        };
        const token = generateAppToken({ id: student.stu_student_id, role: 'student' });
        return { isNewUser: false, user: userForFrontend, token };
    }

    userResult = await pool.query('SELECT * FROM institute_owners WHERE owner_google_id = $1 OR owner_email = $2', [googleProfile.googleId, googleProfile.email]);
    if (userResult.rows.length > 0) {
        const owner = userResult.rows[0];
        // =================================================================
        // <<< THE RESTORED LOGIC >>>
        // This ensures institute owners also have a standardized user object.
        // =================================================================
         const userForFrontend = {
            id: owner.owner_id,
            name: owner.owner_full_name,
            email: owner.owner_email,
            role: 'institute_owner' as const,
            profilePictureUrl: owner.owner_profile_picture_url,
        };
        const token = generateAppToken({ id: owner.owner_id, role: 'institute_owner' });
        return { isNewUser: false, user: userForFrontend, token };
    }
    
    return { isNewUser: true, googleProfile };
};


const registerNewUser = async (
    email: string, 
    googleId: string, 
    profilePictureUrl: string | undefined,
    role: 'student' | 'institute',
    fullName: string,
    mobileNo: string,
    instituteName?: string
) => {
    // ... (pre-registration checks remain the same) ...
    const studentCheck = await pool.query('SELECT stu_student_id FROM students WHERE stu_email = $1', [email]);
    if (studentCheck.rows.length > 0) {
        throw new ApiError(httpStatus.CONFLICT, 'An account with this email already exists as a student.');
    }
    const ownerCheck = await pool.query('SELECT owner_id FROM institute_owners WHERE owner_email = $1', [email]);
    if (ownerCheck.rows.length > 0) {
        throw new ApiError(httpStatus.CONFLICT, 'An account with this email already exists as an institute owner.');
    }
    const finalProfilePicUrl = profilePictureUrl || null;

    if (role === 'student') {
        try {
            const newStudentResult = await pool.query(
                'INSERT INTO students (stu_full_name, stu_email, stu_google_id, stu_profile_picture_url, stu_mobile_no) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [fullName, email, googleId, finalProfilePicUrl, mobileNo]
            );
            const newStudent = newStudentResult.rows[0];
            const userForFrontend = {
                id: newStudent.stu_student_id,
                name: newStudent.stu_full_name,
                email: newStudent.stu_email,
                role: 'student' as const,
                profilePictureUrl: newStudent.stu_profile_picture_url,
            };
            const token = generateAppToken({ id: newStudent.stu_student_id, role: 'student' });
            return { user: userForFrontend, token };
        } catch (error) {
            logger.error('Error creating new student:', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not create student account.');
        }
    }

    if (role === 'institute') {
        if (!instituteName) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Institute name is required for registration.');
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const newOwnerResult = await client.query(
                'INSERT INTO institute_owners (owner_full_name, owner_email, owner_google_id, owner_profile_picture_url, owner_mobile_no) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [fullName, email, googleId, finalProfilePicUrl, mobileNo]
            );
            const newOwner = newOwnerResult.rows[0];

            await client.query(
                'INSERT INTO institutes (inst_name, inst_owner_id) VALUES ($1, $2)',
                [instituteName, newOwner.owner_id]
            );
            
            await client.query('COMMIT');
            
            const userForFrontend = {
                id: newOwner.owner_id,
                name: newOwner.owner_full_name,
                email: newOwner.owner_email,
                role: 'institute_owner' as const,
                profilePictureUrl: newOwner.owner_profile_picture_url,
            };
            const token = generateAppToken({ id: newOwner.owner_id, role: 'institute_owner' });
            return { user: userForFrontend, token };

        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Error creating new institute and owner:', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not create institute account.');
        } finally {
            client.release();
        }
    }
    
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role specified for registration.');
};

export const googleAuthService = {
  handleGoogleSignIn,
  registerNewUser,
};

