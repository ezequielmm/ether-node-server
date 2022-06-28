import { Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { StateManagerService } from './stateManager.service';

@Module({
    imports: [ExpeditionModule],
    providers: [StateManagerService],
    exports: [StateManagerService],
})
export class StateManagerModule {}
