import {
    Controller,
    Post,
    Version,
    Body,
    Res,
    Request,
    Headers,
    UseGuards,
    Get,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginService } from './login.service';
import { LoginDto } from '../login/dto/login.dto';
import { LocalAuthGuard } from 'src/login/local-auth.guard';
import { JwtAuthGuard } from './jwt.auth.guard';

@Controller()
export class LoginController {
    constructor(private readonly service: LoginService) {}

    @Version('1')
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login_V1(@Request() req) {
        return this.service.login_V1(req.user);
    }

    @Version('1')
    @Post('token/refresh')
    async refreshToken_V1(@Body() body: any, @Res() response: Response) {
        try {
            const refreshedToken = await this.service.refreshToken_V1(
                body.token,
            );
            if (!refreshedToken) {
                return response.status(401).json({
                    statusCode: 401,
                    message: 'Un-authorized',
                    data: {},
                });
            }
            return response.status(200).json({
                statusCode: 200,
                message: 'Success',
                data: refreshedToken,
            });
        } catch (error) {
            response.status(500).json({
                statusCode: 500,
                message: 'Internal Server Error',
                data: {},
            });
        }
    }

    @Version('1')
    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async getProfile(@Request() req) {
        return req.user;
    }
}
