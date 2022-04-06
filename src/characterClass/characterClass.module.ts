import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CharacterClassController } from './characterClass.controller';
import { CharacterClassService } from './characterClass.service';

@Module({
    controllers: [CharacterClassController],
    providers: [PrismaService, CharacterClassService],
})
export class CharacterClassModule {}
