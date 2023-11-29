import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { getTimestampInSeconds } from 'src/utils';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardService } from '../components/card/card.service';
import { CharacterClassEnum } from '../components/character/character.enum';
import { Character } from '../components/character/character.schema';
import { CharacterService } from '../components/character/character.service';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { SettingsService } from '../components/settings/settings.service';
import { GearItem } from '../../playerGear/gearItem';
import { Contest } from '../contest/contest.schema';
import { IPlayerToken } from '../components/expedition/expedition.schema';
import { ContestMapService } from '../contestMap/contestMap.service';
import { MapDeckService } from '../components/mapDeck/mapDeck.service';
import { Types } from 'mongoose';
import { Score } from '../components/expedition/scores';
import { GameContext } from '../components/interfaces';

@Injectable()
export class InitExpeditionProcess {
    private readonly logger: Logger = new Logger(InitExpeditionProcess.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly characterService: CharacterService,
        private readonly settingsService: SettingsService,
        private readonly contestMapService: ContestMapService,
        private readonly mapDeckService: MapDeckService,
    ) { }

    async handle({userAddress, playerName, playerToken, equippedGear, character_class, contest, stage}: 
            { userAddress: string; playerName: string; playerToken: IPlayerToken; equippedGear: GearItem[]; character_class: string; contest: Contest; stage: number; }): Promise<void> {

        console.log("character_class:-------------------------------");
        console.log(character_class);
        const character_class_enum = this.getCharcterName(character_class);
        const character = await this.characterService.findOne({characterClass: character_class_enum});

        const { initialPotionChance } = await this.settingsService.getSettings();

        const map = await this.contestMapService.getMapForContest(contest.stages[stage -1]);
        const cards = await this.generatePlayerDeck(character, userAddress, contest, stage);
        
        // Crea un nuevo ObjectId aleatorio
        const randomObjectId = new Types.ObjectId();


        const expedition = await this.expeditionService.create({
            userAddress,
            map: randomObjectId,
            scores: new Score(),
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
            currentStage: stage,
            contest,
            stageScores: [],
            status: ExpeditionStatusEnum.InProgress,
            isCurrentlyPlaying: false,
            createdAt: new Date(),
        });

        const referencedMap = await this.expeditionService.createMapReferenced(
            {
                _id: randomObjectId,
                map
            });

        this.logger.log(
            {
                expId: expedition.id,
            },
            `Created expedition for player: ${userAddress}`,
            `Created referenced map: ' ${referencedMap}`,
        );
    }

    public async createNextStage(ctx: GameContext): Promise<void> {
        const stage = 1 + ctx.expedition.currentStage;
        const map = await this.contestMapService.getMapForContest(ctx.expedition.contest.stages[stage -1]);
        
        //- Por el momento se va a manejar el mismo mazo de cartas para el stage 2:
        //const cards = await this.generatePlayerDeck(character, userAddress, contest, stage);

        const randomObjectId = new Types.ObjectId();

        ctx.expedition.map = randomObjectId;
        ctx.expedition.mapSeedId = getTimestampInSeconds();
        ctx.expedition.playerState.hpCurrent = ctx.expedition.playerState.hpMax;
        ctx.expedition.currentStage = stage;
        ctx.expedition.status = ExpeditionStatusEnum.InProgress;

        await ctx.expedition.save();

        await this.expeditionService.createMapReferenced(
            {
                _id: randomObjectId,
                map
            });
    }

    private async generatePlayerDeck(
        character: Character,
        userAddress: string,
        contest:Contest,
        stage:number
    ): Promise<IExpeditionPlayerStateDeckCard[]> {
        // We destructure the cards from the character
        const { cards: characterDeck } = character;

        // Now we get any custom deck that we have available
        //const customDeck = await this.customDeckService.findByUserAddress(
        //    userAddress,
        //);

        const map = await this.contestMapService.getCompleteMapForContest(contest.stages[stage-1]);
        let mapDeck = undefined ;

        if (map.deck_id) {
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
                    triggerOnDrawn: card.triggerOnDrawn,
                    isActive: true,
                    isFirstPlay: false
                };
            });
    }

    private getCharcterName(characterClass):CharacterClassEnum{
        switch (characterClass) {
            case 'Knight':
                return CharacterClassEnum.Knight;
            case 'Villager':
                return CharacterClassEnum.Villager;
            case 'BlessedVillager':
                return CharacterClassEnum.BlessedVillager;
            case 'NonTokenVillager':
                return CharacterClassEnum.NonTokenVillager;
            case 'KnightInitiated':
                return CharacterClassEnum.KnightInitiated;
            case 'BlessedVillagerInitiated':
                return CharacterClassEnum.BlessedVillagerInitiated;
            default:
                return CharacterClassEnum.Knight;
        }
    }
}
