import { forwardRef, Module } from '@nestjs/common';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { SettingsModule } from '../components/settings/settings.module';
import { RewardModule } from '../reward/reward.module';
import { CombatService } from './combat.service';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        SettingsModule,
        EnemyModule,
        RewardModule,
    ],
    providers: [CombatService],
    exports: [CombatService],
})
export class CombatModule {}
