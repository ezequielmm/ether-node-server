import { Module } from '@nestjs/common';
import { MapService } from '../map.service';
import { CampNodeStrategy } from './strategies/camp-node-strategy';
import { EncounterNodeStrategy } from './strategies/encounter-node-strategy';
import { PortalNodeStrategy } from './strategies/portal-node-strategy';
import { RoyalHouseNodeStrategy } from './strategies/royal-house-node-strategy';

@Module({
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
