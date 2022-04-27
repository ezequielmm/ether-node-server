import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ExpeditionController } from './expedition.controller';
import { CharacterController } from './character.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Character,
    CharacterSchema,
} from '../components/character/character.schema';
import { Trinket, TrinketSchema } from '../components/trinket/trinket.schema';
import { TrinketController } from './trinket.controller';
import { AuthGatewayService } from '../authGateway/authGateway.service.';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Character.name, schema: CharacterSchema },
            { name: Trinket.name, schema: TrinketSchema },
        ]),
        AuthGatewayService,
    ],
    controllers: [
        ProfileController,
        ExpeditionController,
        CharacterController,
        TrinketController,
    ],
})
export class ApiModule {}
