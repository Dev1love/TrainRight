export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 400,
        public isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
} 