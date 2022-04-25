import { Controller, Get, Redirect, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller({
    version: VERSION_NEUTRAL,
})
export class AppController {
    @Get('/')
    @ApiExcludeEndpoint()
    @Redirect('/api')
    handleIndex() {
        return { app: 'KOTE' };
    }
}
