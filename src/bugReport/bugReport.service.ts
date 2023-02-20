import { Injectable } from '@nestjs/common';
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
    ) {}

    async create(payload: BugReportDTO): Promise<BugReportSC> {
        return await this.cardSelectionScreen.create(payload);
    }
}
