import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ExpeditionController } from './expedition.controller';
import { CharacterController } from './character.controller';
import { TrinketController } from './trinket.controller';
import { AuthGatewayModule } from '../authGateway/authGateway.module';
import { CharacterModule } from '../game/components/character/character.module';
import { TrinketModule } from '../game/components/trinket/trinket.module';
import { ExpeditionModule } from '../game/expedition/expedition.module';
import { CardModule } from '../game/components/card/card.module';
import { ProfileModule } from 'src/authGateway/profile/profile.module';

@Module({
    imports: [
        AuthGatewayModule,
        CharacterModule,
        TrinketModule,
        ExpeditionModule,
        CardModule,
        ProfileModule,
    ],
    controllers: [
        ProfileController,
        ExpeditionController,
        CharacterController,
        TrinketController,
    ],
})
export class ApiModule {}
