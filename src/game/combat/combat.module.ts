import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PotionModule } from '../components/potion/potion.module';
import { SettingsModule } from '../components/settings/settings.module';
import { CombatService } from './combat.service';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => CardModule),
        SettingsModule,
        EnemyModule,
        PotionModule,
    ],
    providers: [CombatService],
    exports: [CombatService],
})
export class CombatModule {}
