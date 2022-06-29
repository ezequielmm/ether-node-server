import { Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { SettingsModule } from '../components/settings/settings.module';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';
import { NodeSelectedProcess } from './nodeSelected.process';
import { SendEnemyIntentProcess } from './sendEnemyIntents.process';

@Module({
    imports: [ExpeditionModule, CardModule, SettingsModule, EnemyModule],
    providers: [
        SendEnemyIntentProcess,
        NodeSelectedProcess,
        CurrentNodeGeneratorProcess,
    ],
    exports: [
        SendEnemyIntentProcess,
        NodeSelectedProcess,
        CurrentNodeGeneratorProcess,
    ],
})
export class ProcessModule {}
