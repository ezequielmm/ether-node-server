import { Module } from '@nestjs/common';
import { CharacterClassService } from 'src/character-class/character-class.service';
import { PrismaModule } from 'src/prisma.module';
import { UniqueCodeOnCardsTableRule } from 'src/validators/uniqueCodeOnCardsTable.rule';
import { UniqueNameOnCardsTableRule } from 'src/validators/uniqueNameOnCardsTable.rule';
import { CharacterClassExistsRule } from '../validators/characterClassExists.rule';
import { CardController } from './card.controller';
import { CardService } from './card.service';

@Module({
    imports: [PrismaModule],
    controllers: [CardController],
    providers: [
        CardService,
        CharacterClassService,
        CharacterClassExistsRule,
        UniqueNameOnCardsTableRule,
        UniqueCodeOnCardsTableRule,
    ],
})
export class CardModule {}
