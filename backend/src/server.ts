import app from './app';
import logger from './utils/logger';
import { pool } from './config/database';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
    logger.info(`Server is running on port ${PORT}`);
    try {
        await pool.query('SELECT NOW()');
        logger.info('Database connected successfully.');
    } catch (error) {
        logger.error('Failed to connect to the database.', error);
        process.exit(1);
    }
});

// =================================================================
// <<< IMPROVED ERROR HANDLING >>>
// This will catch specific server startup errors like EADDRINUSE
// and provide a more helpful message instead of a generic crash.
// =================================================================
server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;
    switch (error.code) {
        case 'EACCES':
            logger.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(`${bind} is already in use. Please stop the other process or use a different port.`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});


// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        pool.end(() => {
            logger.info('Database pool has ended');
            process.exit(0);
        });
    });
});

