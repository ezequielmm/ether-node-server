import { forwardRef, Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { CardModule } from '../components/card/card.module';
import { CharacterModule } from '../components/character/character.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { SettingsModule } from '../components/settings/settings.module';
import { EffectModule } from '../effects/effects.module';
import { StatusModule } from '../status/status.module';
import { BeginEnemyTurnProcess } from './beginEnemyTurn.process';
import { BeginPlayerTurnProcess } from './beginPlayerTurn.process';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';
import { EndEnemyTurnProcess } from './endEnemyTurn.process';
import { EndPlayerTurnProcess } from './endPlayerTurn.process';
import { InitCombatProcess } from './initCombat.process';
import { InitExpeditionProcess } from './initExpedition.process';
import { NodeSelectedProcess } from './nodeSelected.process';
import { SendEnemyIntentProcess } from './sendEnemyIntents.process';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        CardModule,
        SettingsModule,
        EnemyModule,
        forwardRef(() => ActionModule),
        CharacterModule,
        StatusModule,
        forwardRef(() => EffectModule),
    ],
    providers: [
        SendEnemyIntentProcess,
        NodeSelectedProcess,
        CurrentNodeGeneratorProcess,
        InitCombatProcess,
        InitExpeditionProcess,
        EndPlayerTurnProcess,
        EndEnemyTurnProcess,
        BeginEnemyTurnProcess,
        BeginPlayerTurnProcess,
    ],
    exports: [
        SendEnemyIntentProcess,
        NodeSelectedProcess,
        CurrentNodeGeneratorProcess,
        InitCombatProcess,
        InitExpeditionProcess,
        EndPlayerTurnProcess,
        EndEnemyTurnProcess,
        BeginEnemyTurnProcess,
        BeginPlayerTurnProcess,
    ],
})
export class ProcessModule {}
