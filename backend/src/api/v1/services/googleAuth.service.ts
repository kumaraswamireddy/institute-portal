import { OAuth2Client, LoginTicket } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { pool } from '../../../config/database';
import ApiError from '../../../utils/ApiError';
import httpStatus from 'http-status';
import logger from '../../../utils/logger';

// ... (constants and other functions remain the same) ...

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
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

const handleGoogleSignIn = async (idToken: string) => {
    const googleProfile = await verifyGoogleToken(idToken);

    let userResult = await pool.query('SELECT * FROM students WHERE stu_google_id = $1 OR stu_email = $2', [googleProfile.googleId, googleProfile.email]);
    if (userResult.rows.length > 0) {
        const student = userResult.rows[0];
        const token = generateAppToken({ id: student.stu_student_id, role: 'student' });
        return { isNewUser: false, user: student, token };
    }

    userResult = await pool.query('SELECT * FROM institute_owners WHERE owner_google_id = $1 OR owner_email = $2', [googleProfile.googleId, googleProfile.email]);
    if (userResult.rows.length > 0) {
        const owner = userResult.rows[0];
        const token = generateAppToken({ id: owner.owner_id, role: 'institute_owner' });
        return { isNewUser: false, user: owner, token };
    }
    
    return { isNewUser: true, googleProfile };
};

const registerNewUser = async (
    email: string, 
    name: string, 
    googleId: string, 
    profilePictureUrl: string | undefined,
    role: 'student' | 'institute', 
    instituteName?: string
) => {
    const studentCheck = await pool.query('SELECT stu_student_id FROM students WHERE stu_email = $1', [email]);
    if (studentCheck.rows.length > 0) {
        throw new ApiError(httpStatus.CONFLICT, 'An account with this email already exists as a student.');
    }
    const ownerCheck = await pool.query('SELECT owner_id FROM institute_owners WHERE owner_email = $1', [email]);
    if (ownerCheck.rows.length > 0) {
        throw new ApiError(httpStatus.CONFLICT, 'An account with this email already exists as an institute owner.');
    }

    // Proactive Improvement: Ensure we pass null instead of undefined to the database
    const finalProfilePicUrl = profilePictureUrl || null;

    if (role === 'student') {
        try {
            const newStudentResult = await pool.query(
                'INSERT INTO students (stu_full_name, stu_email, stu_google_id, stu_profile_picture_url) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, email, googleId, finalProfilePicUrl] // Use the safer variable
            );
            const newStudent = newStudentResult.rows[0];
            const token = generateAppToken({ id: newStudent.stu_student_id, role: 'student' });
            return { user: newStudent, token };
        } catch (error) {
            logger.error('Error creating new student:', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not create student account. Ensure database schema is up to date.');
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
                'INSERT INTO institute_owners (owner_full_name, owner_email, owner_google_id, owner_profile_picture_url) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, email, googleId, finalProfilePicUrl] // Use the safer variable
            );
            const newOwner = newOwnerResult.rows[0];

            await client.query(
                'INSERT INTO institutes (inst_name, inst_owner_id) VALUES ($1, $2)',
                [instituteName, newOwner.owner_id]
            );
            
            await client.query('COMMIT');
            
            const token = generateAppToken({ id: newOwner.owner_id, role: 'institute_owner' });
            return { user: newOwner, token };

        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Error creating new institute and owner:', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not create institute account. Ensure database schema is up to date.');
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

