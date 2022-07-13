import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CardService } from '../components/card/card.service';
import { CharacterClassEnum } from '../components/character/character.enum';
import { CharacterDocument } from '../components/character/character.schema';
import { CharacterService } from '../components/character/character.service';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';

interface InitExpeditionDTO {
    playerId: number;
    playerName: string;
}

@Injectable()
export class InitExpeditionProcess {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly characterService: CharacterService,
    ) {}

    async handle(payload: InitExpeditionDTO): Promise<void> {
        const { playerId, playerName } = payload;

        const character = await this.characterService.findOne({
            characterClass: CharacterClassEnum.Knight,
        });

        const map = this.expeditionService.getMap();

        const cards = await this.generatePlayerDeck(character);

        await this.expeditionService.create({
            playerId,
            map,
            playerState: {
                playerName,
                characterClass: character.characterClass,
                hpMax: character.initialHealth,
                hpCurrent: character.initialHealth,
                gold: character.initialGold,
                cards,
                createdAt: new Date(),
            },
            status: ExpeditionStatusEnum.InProgress,
        });
    }

    private async generatePlayerDeck(
        character: CharacterDocument,
    ): Promise<IExpeditionPlayerStateDeckCard[]> {
        // Get decksettings from character object
        const {
            deckSettings: { cards: cardsIdsArray },
        } = character;

        // Get card ids as an array of integers
        const cardIds = cardsIdsArray.map(({ cardId }) => cardId);

        // Get all the cards
        const cards = await this.cardService.findAll();

        // Filter the card ids and make a new array
        return cards
            .filter((card) => {
                return cardIds.includes(card.cardId);
            })
            .reduce((newDeckCards, card) => {
                cardsIdsArray.forEach((cardId) => {
                    if (card.cardId === cardId.cardId) {
                        for (let i = 1; i <= cardId.amount; i++) {
                            newDeckCards.push(card);
                        }
                    }
                });

                return newDeckCards;
            }, [])
            .map((card) => {
                return {
                    cardId: card.cardId,
                    id: randomUUID(),
                    name: card.name,
                    description: card.description,
                    rarity: card.rarity,
                    energy: card.energy,
                    cardType: card.cardType,
                    pool: card.pool,
                    properties: card.properties,
                    keywords: card.keywords,
                    isTemporary: false,
                    showPointer: card.showPointer,
                    isUpgraded: card.isUpgraded,
                };
            });
    }
}
