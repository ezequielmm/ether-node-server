import { Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { ProcessModule } from '../process/process.module';
import { FullSyncAction } from './fullSync.action';
import { GetEnergyAction } from './getEnergy.action';
import { SetCombatTurnAction } from './setCombatTurn.action';

@Module({
    imports: [ExpeditionModule, ProcessModule],
    providers: [FullSyncAction, SetCombatTurnAction, GetEnergyAction],
    exports: [FullSyncAction, SetCombatTurnAction, GetEnergyAction],
})
export class ActionModule {}
