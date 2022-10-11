import { forwardRef, Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { CardModule } from '../components/card/card.module';
import { CharacterModule } from '../components/character/character.module';
import { CombatQueueModule } from '../components/combatQueue/combatQueue.module';
import { CustomDeckModule } from '../components/customDeck/customDeck.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PlayerModule } from '../components/player/player.module';
import { PotionModule } from '../components/potion/potion.module';
import { SettingsModule } from '../components/settings/settings.module';
import { EffectModule } from '../effects/effects.module';
import { StatusModule } from '../status/status.module';
import { BeginEnemyTurnProcess } from './beginEnemyTurn.process';
import { BeginPlayerTurnProcess } from './beginPlayerTurn.process';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';
import { EndCombatProcess } from './endCombat.process';
import { EndEnemyTurnProcess } from './endEnemyTurn.process';
import { EndPlayerTurnProcess } from './endPlayerTurn.process';
import { InitCombatProcess } from './initCombat.process';
import { InitExpeditionProcess } from './initExpedition.process';
import { InitNodeProcess } from './initNode.process';
import { NodeSelectedProcess } from './nodeSelected.process';
import { SendEnemyIntentProcess } from './sendEnemyIntents.process';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        SettingsModule,
        forwardRef(() => EnemyModule),
        forwardRef(() => ActionModule),
        forwardRef(() => CardModule),
        CharacterModule,
        forwardRef(() => StatusModule),
        PlayerModule,
        forwardRef(() => EffectModule),
        CustomDeckModule,
        CombatQueueModule,
        forwardRef(() => PotionModule),
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
        EndCombatProcess,
        InitNodeProcess,
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
        EndCombatProcess,
        InitNodeProcess,
    ],
})
export class ProcessModule {}
