import { Injectable } from '@nestjs/common';
import { Deck } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DeckService {
    constructor(private service: PrismaService) {}

    async getCharacterDeck_V1(id: string): Promise<Deck> {
        return await this.service.deck.findFirst({
            where: { character_id: id },
        });
    }
}
