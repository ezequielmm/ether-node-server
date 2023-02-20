import { Body, Controller, Post } from '@nestjs/common';
import { BugReportService } from './bugReport.service';
import { BugReportDTO } from './bugReport.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('bugReports')
@Controller('bugReports')
export class BugReportController {
    constructor(private bugReportService: BugReportService) {}

    @ApiOperation({ summary: 'Create a bug report' })
    @Post()
    async create(@Body() message: BugReportDTO): Promise<string> {
        await this.bugReportService.create(message);
        return 'ok';
    }
}
