import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../utils/ApiError';
import httpStatus from 'http-status';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken: string) => {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Google token: No payload found.');
        }
        return payload;
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Google token verification failed.');
    }
};

const generateAppToken = (payload: { id: string; email: string; role: 'student' | 'institute_owner' }) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

const handleGoogleSignIn = async (idToken: string) => {
    const googlePayload = await verifyGoogleToken(idToken);
    const { email, name, sub: googleId } = googlePayload;

    if (!email) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found in Google token.');
    }

    let owner = await prisma.institute_owners.findUnique({ where: { owner_email: email } });
    if (owner) {
        const token = generateAppToken({ id: owner.owner_id, email: owner.owner_email, role: 'institute_owner' });
        return { user: owner, token, isNewUser: false, role: 'institute_owner' };
    }

    let student = await prisma.students.findUnique({ where: { stu_email: email } });
    if (student) {
        const token = generateAppToken({ id: student.stu_student_id, email: student.stu_email, role: 'student' });
        return { user: student, token, isNewUser: false, role: 'student' };
    }

    return { isNewUser: true, email, name: name || '', googleId };
};

const registerNewUser = async (email: string, name: string, googleId: string, role: 'student' | 'institute', instituteName?: string) => {
    if (role === 'student') {
        const newStudent = await prisma.students.create({
            data: {
                stu_email: email,
                stu_full_name: name,
                stu_google_id: googleId,
            },
        });
        const token = generateAppToken({ id: newStudent.stu_student_id, email: newStudent.stu_email, role: 'student' });
        return { user: newStudent, token, role: 'student' };
    }

    if (role === 'institute') {
        if (!instituteName) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Institute name is required for registration.');
        }

        const newOwnerAndInstitute = await prisma.$transaction(async (tx) => {
            const newOwner = await tx.institute_owners.create({
                data: {
                    owner_email: email,
                    owner_full_name: name,
                    owner_google_id: googleId,
                },
            });

            await tx.institutes.create({
                data: {
                    inst_name: instituteName,
                    inst_owner_id: newOwner.owner_id,
                    inst_status: 'pending_approval',
                },
            });

            return newOwner;
        });

        const token = generateAppToken({ id: newOwnerAndInstitute.owner_id, email: newOwnerAndInstitute.owner_email, role: 'institute_owner' });
        return { user: newOwnerAndInstitute, token, role: 'institute_owner' };
    }

    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role specified for registration.');
};

export const googleAuthService = {
    handleGoogleSignIn,
    registerNewUser,
};
