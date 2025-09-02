import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './api/v1/middlewares/error.middleware';
import adminRoutes from './api/v1/routes/admin.routes';
import authRoutes from './api/v1/routes/auth.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Welcome to the Institute Management Portal API',
        version: '1.0.0' 
    });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);


// Error Handling Middleware
app.use(errorMiddleware);

export default app;
