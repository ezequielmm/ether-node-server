import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
const pkg = require('../../package.json');

@ApiTags('showVersion')
@Controller('showVersion')
export class ShowVersionController {
    @ApiOperation({ summary: 'Show version' })
    @Get('/')
    getVersion(): string {
        return pkg.version;
    }
}
