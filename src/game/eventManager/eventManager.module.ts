import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ActivityLogModule } from '../response/activityLog.module';
import { EventManagerService } from './eventManager.service';

@Module({
    imports: [EventEmitterModule.forRoot(), ActivityLogModule],
    providers: [EventManagerService],
    exports: [EventManagerService],
})
export class EventManagerModule {}
