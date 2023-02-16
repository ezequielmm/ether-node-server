import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
const pkg = require('../../package.json');

@Controller('showVersion')
export class ShowVersionController {
    @ApiOperation({ summary: 'Show version' })
    @ApiTags('showVersion')
    @Get('/')
    getVersion(): string {
        return pkg.version;
    }
}
