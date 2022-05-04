import { Module } from '@nestjs/common';
import { ActivityLogService } from './activityLog.service';

@Module({
    providers: [ActivityLogService],
    exports: [ActivityLogService],
})
export class ActivityLogModule {}
