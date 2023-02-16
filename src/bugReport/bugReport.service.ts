import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { BugReportDTO, BugReportSC } from './bugReport.schema';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class BugReportService {
    constructor(
        @InjectModel(BugReportSC)
        private readonly cardSelectionScreen: ReturnModelType<
            typeof BugReportSC
        >,
        private readonly configService: ConfigService,
    ) {}

    async create(payload: BugReportDTO): Promise<BugReportSC> {
        const saveState = mongoose.connection.readyState;
        if (saveState === 0) {
            await mongoose.connect(
                this.configService.get<string>('MONGODB_URL'),
            );
        }
        return await this.cardSelectionScreen.create(payload);
    }
}
