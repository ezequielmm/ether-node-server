import { Body, Controller, Post } from '@nestjs/common';
import { BugReportService } from './bugReport.service';
import { BugReportDTO } from './bugReport.schema';

@Controller('bugReports')
export class BugReportController {
    constructor(private bugReportService: BugReportService) {}

    @Post()
    async create(@Body() message: BugReportDTO): Promise<string> {
        await this.bugReportService.create(message);
        return 'ok';
    }
}
