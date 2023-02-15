import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShowVersionService } from './showVersion.service';
const pkg = require('../../package.json');

@Controller('showVersion')
export class ShowVersionController {
    @Get('/')
    getVersion(): string {
        return pkg.version;
    }
}
