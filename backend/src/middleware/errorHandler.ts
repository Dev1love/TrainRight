import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            isOperational: err.isOperational
        });
    }

    // Handle unknown errors
    console.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Internal server error',
        isOperational: false
    });
}; 