import { Controller, Get, Redirect, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller({
    version: VERSION_NEUTRAL,
})
export class AppController {
    @Redirect('/api')
    @Get()
    handleIndex() {
        return { app: 'Game Service' };
    }
}
