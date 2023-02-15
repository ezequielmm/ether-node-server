import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import mongoose, { model } from 'mongoose';
import { bugReportSchema, IBugReport } from './bugReport.schema';

@Injectable()
export class BugReportService {
    private readonly logger: Logger = new Logger(BugReportService.name);
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async writeBugReport(message: any): Promise<string> {
        const saveState = mongoose.connection.readyState;
        if (saveState === 0) {
            await mongoose.connect(
                this.configService.get<string>('MONGODB_URL'),
            );
        }

        const BugReport = model<IBugReport>('BugReport', bugReportSchema);
        const bugReport = new BugReport(message);
        await bugReport.save();
        if (saveState === 0) {
            await mongoose.disconnect();
        }
        return 'ok';
    }
}
