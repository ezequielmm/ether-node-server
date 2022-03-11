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
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from '../login/dto/login.dto';
import { LocalAuthGuard, RefreshTokenGuard } from 'src/common/guards';
import { Public } from 'src/common/decorators';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id-decorator';
import { GetCurrentUser } from 'src/common/decorators/get-current-user-decorator';
import { Tokens } from './types';

@Controller()
export class LoginController {
    constructor(private readonly service: LoginService) {}

    @Version('1')
    @Public()
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login_V1(@Request() req) {
        return this.service.login_V1(req.user);
    }

    @Version('1')
    @HttpCode(HttpStatus.OK)
    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post('token/refresh')
    async refreshToken_V1(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') refreshToken: string,
    ): Promise<Tokens> {
        return await this.service.refreshToken_V1(userId, refreshToken);
    }
}
