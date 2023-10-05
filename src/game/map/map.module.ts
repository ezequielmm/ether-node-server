import { forwardRef, Module } from '@nestjs/common';
import { CombatModule } from 'src/game/combat/combat.module';
import { MapService } from './map.service';
import { CampNodeStrategy } from './strategies/camp-node-strategy';
import { PortalNodeStrategy } from './strategies/portal-node-strategy';
import { RoyalHouseNodeStrategy } from './strategies/royal-house-node-strategy';
import { TreasureModule } from 'src/game/treasure/treasure.module';
import { EncounterModule } from 'src/game/components/encounter/encounter.module';
import { MerchantModule } from 'src/game/merchant/merchant.module';
import { Expedition, MapType } from '../components/expedition/expedition.schema';
import { KindagooseModule } from 'kindagoose';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { ExpeditionModule } from '../components/expedition/expedition.module';

@Module({
    imports: [
        KindagooseModule.forFeature([MapType]),
        KindagooseModule.forFeature([Expedition]),
        // KindagooseModule.forFeature([ExpeditionService]),
        forwardRef(() => ExpeditionModule),


        forwardRef(() => CombatModule),
        forwardRef(() => TreasureModule),
        forwardRef(() => EncounterModule),
        forwardRef(() => MerchantModule),
    ],
    providers: [
        MapService,
        PortalNodeStrategy,
        RoyalHouseNodeStrategy,
        CampNodeStrategy,
        ExpeditionService,
    ],
    exports: [MapService,
],
})
export class MapModule {}
