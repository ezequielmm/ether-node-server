import { Controller, Get, Res, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import { serverEnvironments } from './utils';

@ApiExcludeController()
@Controller({
    version: VERSION_NEUTRAL,
})
export class AppController {
    constructor(private readonly configService: ConfigService) {}

    @Get()
    handleIndex(@Res() res: Response): void {
        const env = this.configService.get<serverEnvironments>('NODE_ENV');

        if (env === serverEnvironments.development) {
            res.redirect('/api');
        } else {
            res.status(200).json({ app: 'Kote Game Service' });
        }
    }

    @Get('client')
    handleClient(@Res() res: Response): void {
        const env = this.configService.get<serverEnvironments>('NODE_ENV');

        if (env === serverEnvironments.development) {
            const socketUrl =
                this.configService.get<string>('SOCKET_SERVER_URL');
            return res.render('index', { socketUrl });
        } else {
            res.status(200).json({ app: 'Kote Game Service' });
        }
    }
}
