import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardService } from '../components/card/card.service';
import { CharacterClassEnum } from '../components/character/character.enum';
import { CharacterDocument } from '../components/character/character.schema';
import { CharacterService } from '../components/character/character.service';
import { CustomDeckService } from '../components/customDeck/customDeck.service';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { SettingsService } from '../components/settings/settings.service';

interface InitExpeditionDTO {
    playerId: number;
    playerName: string;
    email: string;
}

@Injectable()
export class InitExpeditionProcess {
    private readonly logger: Logger = new Logger(InitExpeditionProcess.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly characterService: CharacterService,
        private readonly customDeckService: CustomDeckService,
        private readonly settingsService: SettingsService,
    ) {}

    async handle(payload: InitExpeditionDTO): Promise<void> {
        const { playerId, playerName, email } = payload;

        const character = await this.characterService.findOne({
            characterClass: CharacterClassEnum.Knight,
        });

        const map = this.expeditionService.getMap();

        const cards = await this.generatePlayerDeck(character, email);

        await this.expeditionService.create({
            playerId,
            map,
            playerState: {
                playerId: randomUUID(),
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

        this.logger.log(`Created expedition for player id: ${playerId}`);
    }

    private async generatePlayerDeck(
        character: CharacterDocument,
        email: string,
    ): Promise<IExpeditionPlayerStateDeckCard[]> {
        const { initialDeckSize } = await this.settingsService.getSettings();

        // We deestructure the cards from the character
        const { cards: characterDeck } = character;

        // we check if we have a custom deck to apply
        // For this user
        const customDeck = await this.customDeckService.findByEmail(email);

        let cardsIdsArray = characterDeck;

        if (customDeck) cardsIdsArray = customDeck.cards;

        // Get card ids as an array of integers
        const cardIds = cardsIdsArray.map(({ cardId }) => cardId);

        // Get all the cards
        const cards = await this.cardService.findCardsById(cardIds);

        // Filter the card ids and make a new array
        return cards
            .reduce((newDeckCards, card) => {
                cardsIdsArray.forEach(({ cardId, amount }) => {
                    if (card.cardId === cardId) {
                        for (let i = 1; i <= amount; i++) {
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
                    description: CardDescriptionFormatter.process(card),
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
            })
            .slice(0, initialDeckSize);
    }
}
