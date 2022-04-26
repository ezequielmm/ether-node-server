/**
 * Validates that the Bearer token is valid
 * @param token The bearer token to validate
 * @return boolean
 */
import { HttpException, HttpStatus } from '@nestjs/common';

export function isValidAuthToken(token: string): boolean {
    if (!token) return false;

    token = token.startsWith('Bearer')
        ? token.replace('Bearer', '').trim()
        : token;

    return !token ? false : true;
}

/**
 * Throws an HttpException and standardizes the response
 * @param message The message to send
 * @param statusCode The status code to respond
 */
export function throwHttpException(
    message: string,
    statusCode: HttpStatus,
): void {
    throw new HttpException(
        { data: { message, status: statusCode } },
        statusCode,
    );
}
