import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ExpeditionController } from './expedition.controller';
import { AuthGatewayModule } from '../authGateway/authGateway.module';
import { CharacterModule } from '../game/components/character/character.module';
import { TrinketModule } from '../game/components/trinket/trinket.module';
import { ExpeditionModule } from '../game/components/expedition/expedition.module';
import { ProcessModule } from 'src/game/process/process.module';

@Module({
    imports: [
        AuthGatewayModule,
        CharacterModule,
        TrinketModule,
        ExpeditionModule,
        ProcessModule,
    ],
    controllers: [ProfileController, ExpeditionController],
})
export class ApiModule {}
