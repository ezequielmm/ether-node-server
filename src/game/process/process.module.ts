import { forwardRef, Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { CombatModule } from '../combat/combat.module';
import { CardModule } from '../components/card/card.module';
import { CharacterModule } from '../components/character/character.module';
import { CombatQueueModule } from '../components/combatQueue/combatQueue.module';
import { CustomDeckModule } from '../components/customDeck/customDeck.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PlayerModule } from '../components/player/player.module';
import { PotionModule } from '../components/potion/potion.module';
import { SettingsModule } from '../components/settings/settings.module';
import { TrinketModule } from '../components/trinket/trinket.module';
import { EffectModule } from '../effects/effects.module';
import { MerchantModule } from '../merchant/merchant.module';
import { StatusModule } from '../status/status.module';
import { TreasureModule } from '../treasure/treasure.module';
import { BeginEnemyTurnProcess } from './beginEnemyTurn.process';
import { BeginPlayerTurnProcess } from './beginPlayerTurn.process';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';
import { EndCombatProcess } from './endCombat.process';
import { EndEnemyTurnProcess } from './endEnemyTurn.process';
import { EndPlayerTurnProcess } from './endPlayerTurn.process';
import { InitCombatProcess } from './initCombat.process';
import { InitExpeditionProcess } from './initExpedition.process';
import { InitMerchantProcess } from './initMerchant.process';
import { InitNodeProcess } from './initNode.process';
import { InitTreasureProcess } from './initTreasure.process';
import { NodeSelectedProcess } from './nodeSelected.process';
import { SendEnemyIntentProcess } from './sendEnemyIntents.process';
import { InitEncounterProcess } from './initEncounter.process';
import { EncounterModule } from '../components/encounter/encounter.module';
import { ContinueExpeditionProcess } from './continueExpedition.process';
import { EndExpeditionProcess } from './endExpedition.process';
import { MapModule } from '../map/map.module';
import { ScoreCalculatorModule } from '../scoreCalculator/scoreCalculator.module';
import { GearModule } from '../components/gear/gear.module';
import { PlayerWinModule } from '../../playerWin/playerWin.module';
import { ContestModule } from '../contest/contest.module';
import { ContestMapModule } from '../contestMap/contestMap.module';
import { PlayerGearModule } from 'src/playerGear/playerGear.module';
import { MapBuilderModule } from '../map/builder/mapBuilder.module';
import { SquiresModule } from 'src/squires-api/squires.module';
import { MapDeckModule } from '../components/mapDeck/mapDeck.module';
import { KindagooseModule } from 'kindagoose';
import { MapType } from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Module({
    imports: [
        KindagooseModule.forFeature([MapType]),
        KindagooseModule.forFeature([ExpeditionService]),


        forwardRef(() => ExpeditionModule),
        forwardRef(() => EnemyModule),
        forwardRef(() => MerchantModule),
        forwardRef(() => TreasureModule),
        forwardRef(() => ActionModule),
        forwardRef(() => CardModule),
        forwardRef(() => StatusModule),
        forwardRef(() => EffectModule),
        forwardRef(() => CombatModule),
        forwardRef(() => PotionModule),
        SettingsModule,
        CharacterModule,
        PlayerModule,
        CustomDeckModule,
        MapDeckModule,
        CombatQueueModule,
        TrinketModule,
        EncounterModule,
        forwardRef(() => MapModule),
        ScoreCalculatorModule,
        GearModule,
        PlayerWinModule,
        ContestModule,
        ContestMapModule,
        PlayerGearModule,
        MapBuilderModule,
        SquiresModule
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
        InitMerchantProcess,
        InitTreasureProcess,
        InitEncounterProcess,
        ContinueExpeditionProcess,
        EndExpeditionProcess,
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
        InitMerchantProcess,
        InitTreasureProcess,
        InitEncounterProcess,
        ContinueExpeditionProcess,
        EndExpeditionProcess,
    ],
})
export class ProcessModule {}
