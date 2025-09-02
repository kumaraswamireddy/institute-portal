// The dotenv import and config MUST be the first lines of code
import dotenv from 'dotenv';
dotenv.config();

// Now we can import the rest of the application
import app from './app';
import { pool } from './config/database';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test the database connection
        const client = await pool.connect();
        logger.info('Database connected successfully.');
        client.release(); // Release the client back to the pool

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        // This will now provide a more detailed error if the connection fails
        logger.error('Failed to connect to the database', error);
        process.exit(1); // Exit the process with an error code
    }
};

startServer();

