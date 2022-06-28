import { StateManagerModule } from './../stateManager/stateManager.module';
import { EventManagerModule } from './../eventManager/eventManager.module';
import { GameManagerService } from './gameManager.service';
import { ActivityLogModule } from './../response/activityLog.module';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
    imports: [ActivityLogModule, EventManagerModule, StateManagerModule],
    providers: [GameManagerService],
    exports: [GameManagerService],
})
export class GameManagerModule {}
