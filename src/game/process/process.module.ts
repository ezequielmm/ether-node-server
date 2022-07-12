import { forwardRef, Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { CardModule } from '../components/card/card.module';
import { CharacterModule } from '../components/character/character.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { SettingsModule } from '../components/settings/settings.module';
import { BeginEnemyTurnProcess } from './beginEnemyTurn.process';
import { BeginPlayerTurnProcess } from './beginPlayerTurn.process';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';
import { DrawCardProcess } from './drawCard.process';
import { EndEnemyTurnProcess } from './endEnemyTurn.process';
import { EndPlayerTurnProcess } from './endPlayerTurn.process';
import { InitCombatProcess } from './initCombat.process';
import { InitExpeditionProcess } from './initExpedition.process';
import { NodeSelectedProcess } from './nodeSelected.process';
import { SendEnemyIntentProcess } from './sendEnemyIntents.process';

@Module({
    imports: [
        ExpeditionModule,
        CardModule,
        SettingsModule,
        EnemyModule,
        forwardRef(() => ActionModule),
        CharacterModule,
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
        DrawCardProcess,
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
        DrawCardProcess,
    ],
})
export class ProcessModule {}
