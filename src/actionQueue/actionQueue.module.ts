import { Module } from '@nestjs/common';
import { ActionQueueService } from './actionQueue.service';

@Module({
    providers: [ActionQueueService],
    exports: [ActionQueueService],
})
export class ActionQueueModule {}
