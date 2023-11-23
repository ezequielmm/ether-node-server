import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Req,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Request } from 'express';
import { ErrorTypes } from 'siwe';
import { AuthService, JsonWebToken } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/nonce')
    getNonce(): { nonce: string; nonceToken: JsonWebToken } {
        const { nonce, nonceToken } = this.authService.generateNonce();
        return { nonce, nonceToken };
    }

    @Post('/authenticate')
    async authenticateSignature(
        @Req() req: Request,
    ): Promise<{ token: string }> {
        if (!req.body.message) {
            throw new UnprocessableEntityException('Body is missing message');
        }

        if (!req.body.signature) {
            throw new UnprocessableEntityException('Body is missing signature');
        }

        if (!req.body.nonceToken) {
            throw new UnprocessableEntityException(
                'Body is missing nonceToken',
            );
        }

        try {
            const token = await this.authService.authenticateSignature({
                nonceToken: req.body.nonceToken,
                message: req.body.message,
                signature: req.body.signature,
            });

            return { token };
        } catch (error) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            const resCode = responseCodeByErrorType(error);
            throw new HttpException(error.message, resCode);
        }
    }
}

function responseCodeByErrorType(error: any): number {
    switch (error) {
        case ErrorTypes.EXPIRED_MESSAGE:
            return HttpStatus.UNPROCESSABLE_ENTITY;
        case ErrorTypes.INVALID_SIGNATURE:
            return HttpStatus.UNPROCESSABLE_ENTITY;
        default:
            return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
