import { Module } from '@nestjs/common';
import { BugReportController } from './bugReport.controller';
import { BugReportService } from './bugReport.service';
import { HttpModule } from '@nestjs/axios';
@Module({
    controllers: [BugReportController],
    imports: [HttpModule],
    providers: [BugReportService],
})
export class BugReportModule {}
