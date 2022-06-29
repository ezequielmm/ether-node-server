import { forwardRef, Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { CardModule } from '../components/card/card.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { SettingsModule } from '../components/settings/settings.module';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';
import { InitCombatProcess } from './initCombat.process';
import { NodeSelectedProcess } from './nodeSelected.process';
import { SendEnemyIntentProcess } from './sendEnemyIntents.process';

@Module({
    imports: [
        ExpeditionModule,
        CardModule,
        SettingsModule,
        EnemyModule,
        forwardRef(() => ActionModule),
    ],
    providers: [
        SendEnemyIntentProcess,
        NodeSelectedProcess,
        CurrentNodeGeneratorProcess,
        InitCombatProcess,
    ],
    exports: [
        SendEnemyIntentProcess,
        NodeSelectedProcess,
        CurrentNodeGeneratorProcess,
        InitCombatProcess,
    ],
})
export class ProcessModule {}
