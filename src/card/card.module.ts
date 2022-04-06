import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CardController } from './card.controller';
import { CardService } from './card.service';

@Module({
    controllers: [CardController],
    providers: [PrismaService, CardService],
})
export class CardModule {}
