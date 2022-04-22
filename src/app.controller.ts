import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller({
    version: VERSION_NEUTRAL,
})
export class AppController {
    @Get('/')
    @ApiExcludeEndpoint()
    handleIndex() {
        return { app: 'KOTE' };
    }
}
