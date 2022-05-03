import { ActivityLog, ActivityLogSchema } from './activityLog.schema';
import { Module } from '@nestjs/common';
import { ActivityLogService } from './activityLog.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: ActivityLog.name,
                schema: ActivityLogSchema,
            },
        ]),
    ],
    providers: [ActivityLogService],
    exports: [ActivityLogService],
})
export class ActivityLogModule {}
