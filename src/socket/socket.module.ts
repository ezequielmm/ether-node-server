import { Module } from '@nestjs/common';
import { AuthGatewayModule } from '../authGateway/authGateway.module';
import { ExpeditionModule } from '../game/components/expedition/expedition.module';
import { SocketGateway } from './socket.gateway';
import { CardModule } from '../game/components/card/card.module';
import { CombatGateway } from './combat.gateway';
import { MoveCardGateway } from './moveCard.gateway';
import { ExpeditionGateway } from './expedition.gateway';
import { ActionModule } from 'src/game/action/action.module';
import { ProcessModule } from 'src/game/process/process.module';
import { CharacterModule } from 'src/game/components/character/character.module';
import { PlayerModule } from 'src/game/components/player/player.module';
import { CombatQueueModule } from 'src/game/components/combatQueue/combatQueue.module';
import { GetDataGateway } from './getData.gateway';
import { RewardGateway } from './reward.gateway';
import { CampGateway } from './camp.gateway';
import { CardSelectionScreenModule } from 'src/game/components/cardSelectionScreen/cardSelectionScreen.module';
import { PotionModule } from 'src/game/components/potion/potion.module';
import { MerchantGateway } from './merchant.gateway';
import { MerchantModule } from 'src/game/merchant/merchant.module';
import { UpgradeCardGateway } from './upgradeCard.gateway';
import { TreasureGateway } from './treasure.gateway';
import { EncounterGateway } from './encounter.gateway';
import { TreasureModule } from 'src/game/treasure/treasure.module';
import { TrinketModule } from 'src/game/components/trinket/trinket.module';
import { RewardModule } from 'src/game/reward/reward.module';
import { EncounterModule } from '../game/components/encounter/encounter.module';
import { UpgradeCardModule } from 'src/game/upgradeCard/upgradeCard.module';
import { CombatModule } from '../game/combat/combat.module';
import { ActionQueueModule } from 'src/actionQueue/actionQueue.module';

@Module({
    imports: [
        AuthGatewayModule,
        ExpeditionModule,
        CardModule,
        ActionModule,
        ProcessModule,
        CharacterModule,
        PlayerModule,
        CombatQueueModule,
        CardSelectionScreenModule,
        PotionModule,
        MerchantModule,
        TreasureModule,
        TrinketModule,
        RewardModule,
        EncounterModule,
        CombatModule,
        UpgradeCardModule,
        ActionQueueModule,
    ],
    providers: [
        SocketGateway,
        CombatGateway,
        MoveCardGateway,
        ExpeditionGateway,
        GetDataGateway,
        RewardGateway,
        CampGateway,
        MerchantGateway,
        UpgradeCardGateway,
        TreasureGateway,
        EncounterGateway,
    ],
})
export class SocketModule {}
