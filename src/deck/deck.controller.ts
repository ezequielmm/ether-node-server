import { Controller, Param, ParseUUIDPipe, Version } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Deck } from '@prisma/client';
import { DeckService } from './deck.service';

@ApiTags('Deck')
@Controller('decks')
export class DeckController {
    constructor(private readonly service: DeckService) {}

    @Version('1')
    @Get('/characters/:character_id')
    async getCharacterDeck_V1(
        @Param('character_id', ParseUUIDPipe) id: string,
    ): Promise<Deck> {
        return await this.service.getCharacterDeck_V1(id);
    }
}
