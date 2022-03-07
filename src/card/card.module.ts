import { Module } from '@nestjs/common';
import { CharacterClassService } from 'src/character-class/character-class.service';
import { PrismaModule } from 'src/prisma.module';
import { CharacterClassExistsRule } from '../validators/characterClassExists.rule';
import { CardController } from './card.controller';
import { CardService } from './card.service';

@Module({
    imports: [PrismaModule],
    controllers: [CardController],
    providers: [CardService, CharacterClassService, CharacterClassExistsRule],
})
export class CardModule {}
