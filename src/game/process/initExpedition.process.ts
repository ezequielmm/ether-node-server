import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { getTimestampInSeconds } from 'src/utils';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardService } from '../components/card/card.service';
import { CharacterClassEnum } from '../components/character/character.enum';
import { Character } from '../components/character/character.schema';
import { CharacterService } from '../components/character/character.service';
import { CustomDeckService } from '../components/customDeck/customDeck.service';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { SettingsService } from '../components/settings/settings.service';
import { MapService } from '../map/map.service';
import { GearItem } from '../../playerGear/gearItem';

@Injectable()
export class InitExpeditionProcess {
    private readonly logger: Logger = new Logger(InitExpeditionProcess.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly characterService: CharacterService,
        private readonly customDeckService: CustomDeckService,
        private readonly settingsService: SettingsService,
        private readonly mapService: MapService,
    ) {}

    async handle({
        playerId,
        playerName,
        email,
        nftId,
        equippedGear,
        character_class,
    }: {
        playerId: number;
        playerName: string;
        email: string;
        nftId: number;
        equippedGear: GearItem[];
        character_class: string;
    }): Promise<void> {
        let character_class_enum = CharacterClassEnum.Knight;
        if (character_class === 'villager')
            character_class_enum = CharacterClassEnum.Villager;
        if (character_class === 'blessed-villager')
            character_class_enum = CharacterClassEnum.BlessedVillager;
        const character = await this.characterService.findOne({
            characterClass: character_class_enum,
        });

        // Get initial player stats
        const { initialPotionChance } =
            await this.settingsService.getSettings();

        // const map = this.expeditionService.getMap();
        const map = this.mapService.getActZero();

        const cards = await this.generatePlayerDeck(character, email);

        const expedition = await this.expeditionService.create({
            playerId,
            map,
            scores: {
                basicEnemiesDefeated: 0,
                eliteEnemiesDefeated: 0,
                bossEnemiesDefeated: 0,
            },
            mapSeedId: getTimestampInSeconds(),
            actConfig: {
                potionChance: initialPotionChance,
            },
            playerState: {
                email,
                playerId: randomUUID(),
                playerName,
                nftId,
                equippedGear,
                characterClass: character.characterClass,
                hpMax: character.initialHealth,
                hpCurrent: character.initialHealth,
                gold: character.initialGold,
                cards,
                potions: [],
                cardUpgradeCount: 0,
                cardDestroyCount: 0,
                trinkets: [],
            },
            status: ExpeditionStatusEnum.InProgress,
            isCurrentlyPlaying: false,
            createdAt: new Date(),
        });

        this.logger.log(
            {
                expId: expedition.id,
            },
            `Created expedition for player id: ${playerId}`,
        );
    }

    private async generatePlayerDeck(
        character: Character,
        email: string,
    ): Promise<IExpeditionPlayerStateDeckCard[]> {
        // We destructure the cards from the character
        const { cards: characterDeck } = character;

        // Now we get any custom deck that we have available
        const customDeck = await this.customDeckService.findByEmail(email);

        // Get card ids as an array of integers
        const cardIds = !customDeck
            ? characterDeck.map(({ cardId }) => Math.round(cardId))
            : customDeck.cards.map(({ cardId }) => Math.round(cardId));

        // Set deck to get the amount of cards
        const deck = !customDeck ? characterDeck : customDeck.cards;

        // Get all the cards
        const cards = await this.cardService.findCardsById(cardIds);

        // Filter the card ids and make a new array
        return cards
            .reduce((newDeckCards, card) => {
                deck.forEach(({ cardId, amount }) => {
                    if (card.cardId === cardId) {
                        this.logger.log(
                            `Added ${amount} ${card.name} cards to ${email} deck`,
                        );
                        for (let i = 1; i <= amount; i++) {
                            newDeckCards.push(card);
                        }
                    }
                });

                return newDeckCards;
            }, [])
            .map((card) => ({
                id: randomUUID(),
                cardId: card.cardId,
                name: card.name,
                cardType: card.cardType,
                energy: card.energy,
                description: CardDescriptionFormatter.process(card),
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
            }));
    }
}
