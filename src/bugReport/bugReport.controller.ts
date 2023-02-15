import { Body, Controller, Post } from '@nestjs/common';
import { BugReportService } from './bugReport.service';

@Controller('bugReports')
export class BugReportController {
    constructor(private bugReportService: BugReportService) {}

    @Post()
    async create(@Body() message: any): Promise<string> {
        return await this.bugReportService.writeBugReport(message);
    }
}
