import {
    Controller,
    Get,
    Logger,
    UseGuards,
    HttpException,
    HttpStatus,
    Req,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
  import { AuthGuard } from '../auth/auth.guard';
  import { CardService } from 'src/game/components/card/card.service';
  import { Card } from 'src/game/components/card/card.schema';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { CardDescriptionFormatter } from 'src/game/cardDescriptionFormatter/cardDescriptionFormatter';
import { randomUUID } from 'crypto';
import { IExpeditionPlayerStateDeckCard } from 'src/game/components/expedition/expedition.interface';
  
  @ApiBearerAuth()
  @ApiTags('Cards')
  @Controller('cards')
  @UseGuards(AuthGuard)
  export class CardController {
    constructor(private readonly cardsService: CardService, private readonly expeditionService: ExpeditionService) {}
  
    private readonly logger: Logger = new Logger(CardController.name);
  
    @ApiOperation({
      summary: 'Get all the cards in the game',
    })
    @Get('/cards')
    async handleGetCards(): Promise<IExpeditionPlayerStateDeckCard[]> {
      this.logger.log(`Client called GET route "/cards"`);
      try {
        const c = await this.cardsService.findAll();
        const cards = await this.generateDeck(c);
        return cards;
      } catch (e) {
        this.logger.error(e.stack);
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: e.message,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }


    
    private async generateDeck(cardsCollection: Card[]): Promise<IExpeditionPlayerStateDeckCard[]> {


        // Get card ids as an array of integers
        const cardIds = cardsCollection.map(card => card.cardId);

        // Set deck to get the amount of cards
        const deck =  cardsCollection;

        // Get all the cards
        const cards = await this.cardsService.findCardsById(cardIds);

        // Filter the card ids and make a new array
        return cards
            .reduce((newDeckCards, card) => {
                deck.forEach(({ cardId }) => {
                    if (card.cardId === cardId) {
                        newDeckCards.push(card);
                    }
                });
                return newDeckCards;
            }, [])
            .map((card) => {
                card.description = CardDescriptionFormatter.process(card);
                this.cardsService.addStatusDescriptions(card);

                return {
                    id: randomUUID(),
                    cardId: card.cardId,
                    name: card.name,
                    cardType: card.cardType,
                    energy: card.energy,
                    description: card.description,
                    isTemporary: false,
                    rarity: card.rarity,
                    properties: card.properties,
                    keywords: card.keywords,
                    showPointer: card.showPointer,
                    pool: card.pool,
                    isUpgraded: card.isUpgraded,
                    upgradedCardId: card?.upgradedCardId,
                    triggerAtEndOfTurn: card.triggerAtEndOfTurn,
                    isActive: true,
                };
            });
    }
  }
  