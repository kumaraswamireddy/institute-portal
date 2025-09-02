import express from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import ApiError from './utils/ApiError'; // Corrected: Use default import
import { errorConverter, errorHandler } from './api/v1/middlewares/error.middleware';
import v1Routes from './api/v1/routes';

const app = express();

// === Global Middlewares ===

// Enable CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

// =================================================================
// <<< THE DEFINITIVE FIX >>>
// The express.json() middleware MUST be placed BEFORE the routes are mounted.
// This ensures that the request body is parsed before it reaches the route handlers.
// =================================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- API Routes ---
// Mount all v1 routes under the /api/v1 prefix
app.use('/api/v1', v1Routes);


// --- Health Check Route ---
app.get('/', (req, res) => {
    res.status(200).send('Server is healthy!');
});

// --- Error Handling ---
// Handle 404 for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

export default app;

