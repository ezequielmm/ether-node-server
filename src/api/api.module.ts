import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ExpeditionController } from './expedition.controller';
import { CharacterController } from './character.controller';

@Module({
    controllers: [ProfileController, ExpeditionController, CharacterController],
})
export class ApiModule {}
