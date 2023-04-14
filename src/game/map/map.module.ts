import { forwardRef, Module } from '@nestjs/common';
import { CombatModule } from 'src/game/combat/combat.module';
import { MapService } from './map.service';
import { CampNodeStrategy } from './strategies/camp-node-strategy';
import { EncounterNodeStrategy } from './strategies/encounter-node-strategy';
import { PortalNodeStrategy } from './strategies/portal-node-strategy';
import { RoyalHouseNodeStrategy } from './strategies/royal-house-node-strategy';
import { TreasureModule } from 'src/game/treasure/treasure.module';
import { EncounterModule } from 'src/game/components/encounter/encounter.module';
import { MerchantModule } from 'src/game/merchant/merchant.module';

@Module({
    imports: [
        forwardRef(() => CombatModule),
        forwardRef(() => TreasureModule),
        forwardRef(() => EncounterModule),
        forwardRef(() => MerchantModule),
    ],
    providers: [
        MapService,
        PortalNodeStrategy,
        RoyalHouseNodeStrategy,
        EncounterNodeStrategy,
        CampNodeStrategy,
    ],
    exports: [MapService],
})
export class MapModule {}
