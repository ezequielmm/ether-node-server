import { EventManagerModule } from './../eventManager/eventManager.module';
import { GameManagerService } from './gameManager.service';
import { ActivityLogModule } from './../response/activityLog.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [ActivityLogModule, EventManagerModule],
    providers: [GameManagerService],
    exports: [GameManagerService],
})
export class GameManagerModule {}
