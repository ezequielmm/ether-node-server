import { Module } from '@nestjs/common';
import { BugReportController } from './bugReport.controller';
import { BugReportService } from './bugReport.service';
import { KindagooseModule } from 'kindagoose';
import { BugReportSC } from './bugReport.schema';
@Module({
    controllers: [BugReportController],
    imports: [KindagooseModule.forFeature([BugReportSC])],
    providers: [BugReportService],
})
export class BugReportModule {}
