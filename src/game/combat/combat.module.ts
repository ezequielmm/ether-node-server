import { forwardRef, Module } from '@nestjs/common';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { SettingsModule } from '../components/settings/settings.module';
import { RewardModule } from '../reward/reward.module';
import { CombatService } from './combat.service';
import { CardSelectionScreenModule } from '../components/cardSelectionScreen/cardSelectionScreen.module';
import { ActionModule } from '../action/action.module';
import { CardModule } from '../components/card/card.module';
import { PlayerModule } from '../components/player/player.module';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => EnemyModule),
        forwardRef(() => ActionModule),
        forwardRef(() => CardModule),
        forwardRef(() => PlayerModule),
        SettingsModule,
        RewardModule,
        CardSelectionScreenModule,
    ],
    providers: [CombatService],
    exports: [CombatService],
})
export class CombatModule {}
