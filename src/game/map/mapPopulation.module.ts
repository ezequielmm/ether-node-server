import { forwardRef, Module } from '@nestjs/common';
import { CombatModule } from 'src/game/combat/combat.module';
import { TreasureModule } from 'src/game/treasure/treasure.module';
import { EncounterModule } from 'src/game/components/encounter/encounter.module';
import { MerchantModule } from 'src/game/merchant/merchant.module';
import { MapPopulationService } from './mapPopulation.service';

@Module({
    imports: [
        forwardRef(() => CombatModule),
        forwardRef(() => TreasureModule),
        forwardRef(() => EncounterModule),
        forwardRef(() => MerchantModule),
    ],
    providers: [MapPopulationService],
    exports: [MapPopulationService],
})
export class MapPopulationModule {}
