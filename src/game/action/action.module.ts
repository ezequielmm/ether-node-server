import { Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { ProcessModule } from '../process/process.module';
import { FullSyncAction } from './fullSync.action';
import { SetCombatTurnAction } from './setCombatTurn.action';

@Module({
    imports: [ExpeditionModule, ProcessModule],
    providers: [FullSyncAction, SetCombatTurnAction],
    exports: [FullSyncAction, SetCombatTurnAction],
})
export class ActionModule {}
