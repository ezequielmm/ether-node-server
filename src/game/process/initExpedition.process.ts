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
import { GearItem } from '../../playerGear/gearItem';
import { Contest } from '../contest/contest.schema';
import { IPlayerToken } from '../components/expedition/expedition.schema';
import { ContestMapService } from '../contestMap/contestMap.service';
import { ContestService } from '../contest/contest.service';
import { MapDeckService } from '../components/mapDeck/mapDeck.service';
import { MapService } from '../map/map.service';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class InitExpeditionProcess {
    private readonly logger: Logger = new Logger(InitExpeditionProcess.name);

    @InjectModel(MapService)
    private readonly mapService: ReturnModelType<typeof MapService>
    
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly characterService: CharacterService,
        private readonly customDeckService: CustomDeckService,
        private readonly settingsService: SettingsService,
        // private readonly mapBuilderService: MapBuilderService,
        private readonly contestService: ContestService,
        private readonly contestMapService: ContestMapService,
        private readonly mapDeckService:MapDeckService
    ) {}

    async handle({
        userAddress,
        playerName,
        playerToken,
        equippedGear,
        character_class,
        contest,
    }: {
        userAddress: string;
        playerName: string;
        playerToken: IPlayerToken;
        equippedGear: GearItem[];
        character_class: string;
        contest: Contest;
    }): Promise<void> {
        try {
            let character_class_enum = CharacterClassEnum.Knight;
    
            switch (character_class) {
                case 'Knight':
                    character_class_enum = CharacterClassEnum.Knight;
                    break;
                case 'Villager':
                    character_class_enum = CharacterClassEnum.Villager;
                    break;
                case 'BlessedVillager':
                    character_class_enum = CharacterClassEnum.BlessedVillager;
                    break;
                case 'NonTokenVillager':
                    character_class_enum = CharacterClassEnum.NonTokenVillager;
                    break;
                default:
                    character_class_enum = CharacterClassEnum.Knight;
                    break;
            }
    
            const character = await this.characterService.findOne({
                characterClass: character_class_enum,
            });
    
            const { initialPotionChance } = await this.settingsService.getSettings();
    
            const mapData = {
                // Aquí se coloca el JSON del mapa según la nueva estructura
            };
    
            const map = await this.mapService.create(mapData);
    
            const cards = await this.generatePlayerDeck(character, userAddress, contest);
    
            const expeditionData = {
                userAddress,
                map: map._id, // Guardamos la referencia del mapa en la expedición
                scores: {
                    basicEnemiesDefeated: 0,
                    eliteEnemiesDefeated: 0,
                    bossEnemiesDefeated: 0,
                    minionEnemiesDefeated: 0,
                },
                mapSeedId: getTimestampInSeconds(),
                actConfig: {
                    potionChance: initialPotionChance,
                },
                playerState: {
                    userAddress,
                    playerToken,
                    playerName,
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
                    lootboxRarity: character.lootboxRarity,
                    lootboxSize: character.lootboxSize ?? 0,
                },
                contest,
                status: ExpeditionStatusEnum.InProgress,
                isCurrentlyPlaying: false,
                createdAt: new Date(),
            };
    
            const expedition = await this.expeditionService.create(expeditionData);
    
            this.logger.log(
                {
                    expId: expedition.id,
                },
                `Created expedition for player: ${userAddress}`
            );
        } catch (error) {
            this.logger.error('Error occurred while processing the request', error);
            // Manejar el error, enviar mensajes de error, etc.
        }
    }

    private async generatePlayerDeck(
        character: Character,
        userAddress: string,
        contest:Contest
    ): Promise<IExpeditionPlayerStateDeckCard[]> {
        // We destructure the cards from the character
        const { cards: characterDeck } = character;

        // Now we get any custom deck that we have available
        //const customDeck = await this.customDeckService.findByUserAddress(
        //    userAddress,
        //);

        const map = await this.contestMapService.getCompleteMapForContest(contest);
        let mapDeck = undefined ;

        if(map.deck_id){
            mapDeck = await this.mapDeckService.findById(map.deck_id);
        }

        // Get card ids as an array of integers
        const cardIds = !mapDeck
            ? characterDeck.map(({ cardId }) => Math.round(cardId))
            : mapDeck.cards.map(({ cardId }) => Math.round(cardId));

        // Set deck to get the amount of cards
        const deck = !mapDeck ? characterDeck : mapDeck.cards;

        // Get all the cards
        const cards = await this.cardService.findCardsById(cardIds);

        // Filter the card ids and make a new array
        return cards
            .reduce((newDeckCards, card) => {
                deck.forEach(({ cardId, amount }) => {
                    if (card.cardId === cardId) {
                        this.logger.log(
                            `Added ${amount} ${card.name} cards to ${userAddress} deck`,
                        );
                        for (let i = 1; i <= amount; i++) {
                            newDeckCards.push(card);
                        }
                    }
                });

                return newDeckCards;
            }, [])
            .map((card) => {
                card.description = CardDescriptionFormatter.process(card);
                this.cardService.addStatusDescriptions(card);

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
                    isFirstPlay: false
                };
            });
    }
}
