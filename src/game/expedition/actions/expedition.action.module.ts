import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../../components/expedition/expedition.module';
import { FullSyncAction } from './fullSync.action';
import { NodeSelectedAction } from './nodeSelected.action';
import { CardModule } from '../../components/card/card.module';
import { CurrentNodeGenerator } from './currentNode.generator';
import { SettingsModule } from 'src/game/components/settings/settings.module';
import { CombatProcessModule } from 'src/game/node_combat/process/combatProcess.module';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => CardModule),
        SettingsModule,
        CombatProcessModule,
    ],
    providers: [FullSyncAction, NodeSelectedAction, CurrentNodeGenerator],
    exports: [FullSyncAction, NodeSelectedAction],
})
export class ExpeditionActionModule {}
