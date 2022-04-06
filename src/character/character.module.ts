import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';

@Module({
    controllers: [CharacterController],
    providers: [PrismaService, CharacterService],
})
export class CharacterModule {}
