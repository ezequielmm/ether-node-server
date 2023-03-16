import { Module } from '@nestjs/common';
import { SocketQueueService } from './socketQueue.service';

@Module({
    providers: [SocketQueueService],
    exports: [SocketQueueService],
})
export class SocketQueueModule {}
