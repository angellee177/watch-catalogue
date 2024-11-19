import { Logger } from '@nestjs/common';
import { UserResultDto } from '../users/dto/user.dto';
import { User } from '../users/entity/user.entity';

/**
 * Set Central Log
 * 
 * @param options - Logging options
 * @param options.level - Log level (e.g., 'info', 'warn', 'error')
 * @param options.method - The method name or context
 * @param options.message - Log message
 * @param options.error - Optional error object
 * @param options.others - Optional additional information
 */
export const setLog = (options: {
    level: 'info' | 'warn' | 'error';
    method: string;
    message: string;
    error?: Error;
    others?: string;
}) => {
    const logger = new Logger(options.method);

    // Sanitize input (optional, to avoid unnecessary logs or issues)
    const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9\s]/g, '').trim();

    const level = sanitize(options.level).toUpperCase();
    const method = sanitize(options.method);
    const message = sanitize(options.message);
    const others = options.others ? sanitize(options.others) : null;

    let logOutput = `${level}: ${method} -> ${message}`;
    if (others) logOutput += ` (${others})`;

    // Log based on the level
    switch (options.level) {
    case 'info':
        logger.log(logOutput);
        break;
    case 'warn':
        logger.warn(logOutput);
        if (options.error) logger.warn(options.error.stack || options.error.message);
        break;
    case 'error':
        logger.error(logOutput);
        if (options.error) logger.error(options.error.stack || options.error.message);
        break;
    default:
        logger.debug(logOutput); // Default to debug for unknown levels
        break;
    }
};

/**
 *  Helper method to map User entity to UserResultDto
 * 
 * @param user 
 * @returns UserResultDto
 */
export const transformToUserResultDto = (
    user: User
    ): UserResultDto => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}