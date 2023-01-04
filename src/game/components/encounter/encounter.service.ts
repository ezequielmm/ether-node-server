import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Encounter } from './encounter.schema';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../../standardResponse/standardResponse';
import { ExpeditionService } from '../expedition/expedition.service';
import { Socket } from 'socket.io';
import { EncounterButton, EncounterInterface } from './encounter.interfaces';
import { EncounterDTO } from '../../action/getEncounterDataAction';
import { DataWSRequestTypesEnum } from '../../../socket/socket.enum';
import { ReturnModelType } from '@typegoose/typegoose';
import { getRandomBetween, getRandomItemByWeight } from 'src/utils';
import { EncounterIdEnum } from './encounter.enum';
import { CardService } from '../card/card.service';
import { GameContext } from '../interfaces';
import { TrinketService } from '../trinket/trinket.service';
import { IExpeditionPlayerStateDeckCard } from '../expedition/expedition.interface';
import { randomUUID } from 'crypto';
import { CardDescriptionFormatter } from '../../cardDescriptionFormatter/cardDescriptionFormatter';
import { PotionService } from '../potion/potion.service';
import { Player } from '../expedition/player';
import { CardRarityEnum } from '../card/card.enum';
import { logger } from '@typegoose/typegoose/lib/logSettings';

@Injectable()
export class EncounterService {
    constructor(
        @InjectModel(Encounter)
        private readonly encounterModel: ReturnModelType<typeof Encounter>,
        private readonly expeditionService: ExpeditionService,

        private readonly cardService: CardService,
        private readonly trinketService: TrinketService,
        private readonly potionService: PotionService,
    ) {}

    async generateEncounter(ctx: GameContext): Promise<EncounterInterface> {
        //generate encounter
        let encounterId = getRandomItemByWeight(
            [
                EncounterIdEnum.AbandonedAltar, // [3 jan 2023] customer is not going to provide art
                EncounterIdEnum.Rugburn, // [3 jan 2023] wont do
                EncounterIdEnum.Nagpra, //3 TODO disabled due to server crashing bug
                EncounterIdEnum.TreeCarving,
                EncounterIdEnum.Naiad,
                EncounterIdEnum.WillOWisp, //6
                EncounterIdEnum.DancingSatyr, //7
                EncounterIdEnum.EnchantedForest, //8
                EncounterIdEnum.MossyTroll,
                EncounterIdEnum.YoungWizard,
                EncounterIdEnum.Oddbarks, // 11
                EncounterIdEnum.RunicBehive,
            ],
            //      1  2  3  4  5  6  7  8  9  10 11 12
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        );

        //fetch existing encounter if there is one
        const encounterData = await this.getEncounterData(ctx.client);
        if (encounterData) {
            encounterId = encounterData.encounterId;
        }

        return {
            encounterId,
            stage: 0,
        };
    }

    async encounterChoice(client: Socket, choiceIdx: number): Promise<string> {
        const ctx = await this.expeditionService.getGameContext(client);
        const expedition = ctx.expedition;
        const playerState = await this.expeditionService.getPlayerState({
            clientId: client.id,
        });
        const encounterData = await this.getEncounterData(client);
        const encounter = await this.getByEncounterId(
            encounterData.encounterId,
        );
        const stage = encounter.stages[encounterData.stage];

        if (choiceIdx >= stage.buttons.length || choiceIdx < 0) {
            // impossible condition. used temporarily for QA
            return StandardResponse.respond({
                message_type: SWARMessageType.EncounterUpdate,
                action: SWARAction.FinishEncounter,
                data: {},
            });
        }

        const buttonPressed = stage.buttons[choiceIdx];
        if (buttonPressed.randomStaging) {
            const r = getRandomBetween(
                0,
                buttonPressed.randomStaging.length - 1,
            );
            const randomStage = buttonPressed.randomStaging[r];
            buttonPressed.effects = randomStage.effects;
            buttonPressed.nextStage = randomStage.nextStage;
        }
        await this.applyEffects(buttonPressed.effects, client);

        if (buttonPressed.awaitModal) {
            await this.expeditionService.updateById(expedition._id.toString(), {
                $set: {
                    'currentNode.encounterData.afterModal':
                        buttonPressed.nextStage,
                },
            });
        } else {
            await this.updateEncounterData(
                encounterData.encounterId,
                buttonPressed.nextStage,
                client,
            );
        }
        const data = await this.getEncounterDTO(client, playerState);

        return StandardResponse.respond({
            message_type: SWARMessageType.GenericData,
            action: DataWSRequestTypesEnum.EncounterData,
            data,
        });
    }

    private async incrMaxHp(
        amount: number,
        playerState: Player,
        expeditionId: string,
    ) {
        if (playerState.hpMax + amount < 0) {
            amount = -playerState.hpMax;
        }
        await this.expeditionService.updateById(expeditionId, {
            $inc: {
                'playerState.hpMax': amount,
            },
        });
    }

    private async incrHp(
        amount: number,
        playerState: Player,
        expeditionId: string,
    ) {
        if (playerState.hpCurrent + amount < 0) {
            amount = -playerState.hpCurrent;
        }
        if (playerState.hpCurrent + amount < playerState.hpMax) {
            amount = playerState.hpMax - playerState.hpCurrent;
        }
        await this.expeditionService.updateById(expeditionId, {
            $inc: {
                'playerState.hpCurrent': amount,
            },
        });
    }

    private async applyEffects(effects: any[], client: Socket): Promise<void> {
        for (let i = 0; i < effects.length; i++) {
            const effect = effects[i];
            const ctx = await this.expeditionService.getGameContext(client);
            const expedition = ctx.expedition;
            const expeditionId = expedition._id.toString();
            const playerState = await this.expeditionService.getPlayerState({
                clientId: client.id,
            });
            let amount = 0;

            switch (effect.kind) {
                case 'coin': //eg nagpra
                    amount = parseInt(effect.amount);

                    if (playerState.gold + amount < 0) {
                        // no negative gold
                        amount = -playerState.gold;
                    }

                    await this.expeditionService.updateById(expeditionId, {
                        $inc: {
                            'playerState.gold': amount,
                        },
                    });
                    break;
                case 'hp_max_random': //eg will o wisp
                    const max = parseInt(effect.max);
                    const min = parseInt(effect.min);
                    amount = getRandomBetween(min, max);
                    await this.incrMaxHp(amount, playerState, expeditionId);
                    break;
                case 'hp_max':
                    amount = parseInt(effect.amount);
                    await this.incrMaxHp(amount, playerState, expeditionId);
                    break;
                case 'hit_points': //eg rug burn
                    amount = parseInt(effect.amount);
                    await this.incrHp(amount, playerState, expeditionId);
                    break;

                case 'upgrade_random_card': //eg will o wisp
                    await this.upgradeRandomCard(client, playerState);
                    break;
                case 'loose_random_card':
                    await this.looseRandomCard(client, playerState);
                    break;
                case 'card_add_to_library': //eg naiad
                    const cardId = parseInt(effect.cardId);
                    await this.cardService.addCardToDeck(ctx, cardId);
                    break;
                case 'choose_trinket':
                    amount = parseInt(effect.amount);
                    await this.chooseTrinket(client, playerState, amount);
                    break;
                case 'choose_card_to_sacrifice': // abandon altar
                    await this.chooseCardRemove(client, playerState);
                    break;
                case 'choose_card_remove': // Enchanted Forest
                    await this.chooseCardRemove(client, playerState);
                    break;
                case 'choose_card_upgrade': // Enchanted Forest
                    await this.chooseCardUpgrade(client, playerState);
                    break;
                case 'fatigue': // tree carving
                case 'imbued': // tree carving
                case 'feeble': // tree carving
                    break;
                case 'trinket':
                    switch (effect.item) {
                        case 'birdcage': //nagpra
                            await this.trinketService.add(ctx, 3);
                            break;
                        case 'runic_tome': //young wizard
                            await this.trinketService.add(ctx, 2); //TODO need correct trinket id
                            break;
                        case 'pan_flute': //satyr
                            await this.trinketService.add(ctx, 45);
                            break;
                        case 'silver_pan_flute': //satyr
                            await this.trinketService.add(ctx, 46);
                            break;
                        case 'golden_pan_flute': //satyr
                            await this.trinketService.add(ctx, 47);
                            break;
                    }
                    break;
                case 'brimbles_quest': // mossy troll
                    break;
            }
        }
    }

    private async chooseTrinket(
        client: Socket,
        playerState: Player,
        amount: number,
    ): Promise<void> {
        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.EncounterUpdate,
                action: SWARAction.SelectTrinkets,
                data: {
                    trinkets: playerState.trinkets,
                    trinketsToTake: amount,
                    kind: 'remove',
                },
            }),
        );
    }

    private async chooseCardRemove(
        client: Socket,
        playerState: Player,
    ): Promise<void> {
        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.EncounterUpdate,
                action: SWARAction.ShowCards,
                data: {
                    cards: playerState.cards,
                    cardsToTake: 1,
                    kind: 'remove',
                },
            }),
        );
    }

    private async chooseCardUpgrade(
        client: Socket,
        playerState: Player,
    ): Promise<void> {
        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.EncounterUpdate,
                action: SWARAction.ShowCards,
                data: {
                    cards: playerState.cards,
                    cardsToTake: 1,
                    kind: 'upgrade',
                },
            }),
        );
    }

    private async looseRandomCard(
        client: Socket,
        playerState: Player,
    ): Promise<void> {
        const cardIds: number[] = [];
        const probabilityWeights: number[] = [];

        for (const card of playerState.cards) {
            cardIds.push(card.cardId);
            probabilityWeights.push(1);
        }

        if (cardIds.length == 0) return; // no cards in hand

        const looseMeCardId = getRandomItemByWeight(
            cardIds,
            probabilityWeights,
        );

        await this.looseCard(looseMeCardId, playerState, client);
    }

    async looseCard(
        cardId: string | number,
        playerState: Player,
        client: Socket,
    ): Promise<void> {
        let hasLostOne = false;
        const newCards = playerState.cards.filter((item) => {
            if (item.cardId == cardId && !hasLostOne) {
                hasLostOne = true;
                return false;
            } else {
                return true;
            }
        });

        const newPlayerState = {
            ...playerState, //don't toObject() here
            cards: newCards,
        };

        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                $set: {
                    playerState: newPlayerState,
                },
            },
        );
    }

    private async upgradeRandomCard(
        client: Socket,
        playerState: Player,
    ): Promise<void> {
        const cardIds: number[] = [];
        const probabilityWeights: number[] = [];

        for (const card of playerState.cards) {
            if (!card.isUpgraded && card.upgradedCardId) {
                cardIds.push(card.cardId);
                probabilityWeights.push(1);
            }
        }

        if (cardIds.length == 0) return; // no cards qualify for upgrade

        const upgradeMeCardId = getRandomItemByWeight(
            cardIds,
            probabilityWeights,
        );

        await this.upgradeCard(upgradeMeCardId, playerState, client);
        //see MerchantService
    }

    async getByEncounterId(encounterId: number): Promise<Encounter> {
        const encounter = await this.encounterModel
            .findOne({ encounterId })
            .exec();
        return encounter;
    }

    async getEncounterDTO(
        client: Socket,
        playerState: Player,
        overrideTextKey: string = null,
    ): Promise<EncounterDTO> {
        const encounterData = await this.getEncounterData(client);
        const encounter = await this.getByEncounterId(
            encounterData.encounterId,
        );
        const stage = encounter.stages[encounterData.stage];
        const buttons: {
            text: string;
            enabled: boolean;
        }[] = [];
        for (let i = 0; i < stage.buttons.length; i++) {
            const button = stage.buttons[i];
            const enabled = this.calculateEnabledState(button, playerState);
            const text = button.text;
            buttons.push({
                text,
                enabled,
            });
        }
        const encounterName = encounter.encounterName;
        let displayText = stage.displayText;
        if (overrideTextKey && encounter.overrideDisplayText) {
            displayText = encounter.overrideDisplayText[overrideTextKey];
        }
        const imageId = encounter.imageId;
        const answer: EncounterDTO = {
            encounterName,
            imageId,
            displayText,
            buttons,
        };
        return answer;
    }

    private calculateEnabledState(
        button: EncounterButton,
        playerState: Player,
    ): boolean {
        for (let i = 0; i < button.effects.length; i++) {
            const effect = button.effects[i];
            if (effect.kind === 'coin') {
                const amount = parseInt(effect.amount);
                if (playerState.gold + amount < 0) {
                    return false;
                }
            }
            if (effect.kind === 'choose_trinket') {
                const amount = parseInt(effect.amount);
                if (playerState.trinkets.length < amount) {
                    return false;
                }
            }
        }
        return true;
    }

    async updateEncounterData(
        encounterId: number,
        stage: number,
        client: Socket,
    ): Promise<void> {
        const encounterData = {
            encounterId,
            stage,
        };

        const ctx = await this.expeditionService.getGameContext(client);
        const expedition = ctx.expedition;
        await this.expeditionService.updateById(expedition._id.toString(), {
            $set: {
                'currentNode.encounterData': encounterData,
            },
        });
    }

    async getEncounterData(client: Socket): Promise<EncounterInterface> {
        const ctx = await this.expeditionService.getGameContext(client);
        const expedition = ctx.expedition;
        const encounterData: EncounterInterface =
            expedition.currentNode.encounterData;
        return encounterData;
    }

    async upgradeCard(
        cardId: string | number,
        playerState: Player,
        client: Socket,
    ): Promise<void> {
        const card = await this.cardService.findById(cardId);

        const upgradedCardData = await this.cardService.findById(
            card.upgradedCardId,
        );

        const upgradedCard: IExpeditionPlayerStateDeckCard = {
            id: randomUUID(),
            cardId: card.cardId,
            name: upgradedCardData.name,
            cardType: upgradedCardData.cardType,
            energy: upgradedCardData.energy,
            description: CardDescriptionFormatter.process(upgradedCardData),
            isTemporary: false,
            rarity: upgradedCardData.rarity,
            properties: upgradedCardData.properties,
            keywords: upgradedCardData.keywords,
            showPointer: upgradedCardData.showPointer,
            pool: upgradedCardData.pool,
            isUpgraded: upgradedCardData.isUpgraded,
            isActive: true,
        };

        let isUpgraded = false;
        const newCards = playerState.cards.map((item) => {
            if (item.cardId == card.cardId && !isUpgraded) {
                isUpgraded = true;
                return upgradedCard;
            } else {
                return item;
            }
        });

        const newCardUpgradeCount = playerState.cardUpgradeCount + 1;

        const newPlayerState = {
            ...playerState, //don't toObject() here
            cards: newCards,
            cardUpgradeCount: newCardUpgradeCount,
        };

        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                $set: {
                    playerState: newPlayerState,
                },
            },
        );
    }

    async handleUpgradeCard(client: Socket, cardId: string): Promise<void> {
        await this.postModalStage(client);
    }

    private async postModalStage(
        client: Socket,
        overrideTextKey: string = null,
    ): Promise<void> {
        const playerState = await this.expeditionService.getPlayerState({
            clientId: client.id,
        });
        const encounterData = await this.getEncounterData(client);

        await this.updateEncounterData(
            encounterData.encounterId,
            encounterData.afterModal,
            client,
        );

        const data = await this.getEncounterDTO(
            client,
            playerState,
            overrideTextKey,
        );

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.GenericData,
                action: DataWSRequestTypesEnum.EncounterData,
                data,
            }),
        );
    }

    async handleMoveCard(client: Socket, payload: string): Promise<void> {
        const payloadJson = JSON.parse(payload);
        const cardToTake = payloadJson.cardsToTake[0];
        const playerState = await this.expeditionService.getPlayerState({
            clientId: client.id,
        });
        let removeMe = null; //indicates hacked client
        for (let i = 0; i < playerState.cards.length; i++) {
            const card = playerState.cards[i];
            if (card.id === cardToTake) {
                removeMe = card;
            }
        }

        const newCards = playerState.cards.filter((card) => {
            if (card.id == cardToTake) {
                return false;
            } else {
                return true;
            }
        });

        const newPlayerState = {
            ...playerState,
            cards: newCards,
        };

        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                $set: {
                    playerState: newPlayerState,
                },
            },
        );

        const encounterData = await this.getEncounterData(client);
        const encounterKind = await this.getByEncounterId(
            encounterData.encounterId,
        );
        await this.applyPostCardChoiceEffects(
            client,
            playerState,
            encounterKind.postCardChoiceEffect,
            removeMe,
        );

        await this.postModalStage(
            client,
            this.rarityToOverrideKey(removeMe.rarity),
        );
    }

    private async applyPostCardChoiceEffects(
        client: Socket,
        playerState: Player,
        effect: string,
        removeMe: IExpeditionPlayerStateDeckCard,
    ): Promise<void> {
        const ctx = await this.expeditionService.getGameContext(client);
        const expedition = ctx.expedition;
        const expeditionId = expedition._id.toString();
        switch (effect) {
            case 'abandon_altar':
                switch (removeMe.rarity) {
                    case CardRarityEnum.Special: //abandon altar treat special as cursed
                    case CardRarityEnum.Starter:
                        break;
                    case CardRarityEnum.Common:
                        await this.incrHp(5, playerState, expeditionId);
                        break;
                    case CardRarityEnum.Uncommon:
                        await this.incrHp(
                            playerState.hpMax - playerState.hpCurrent,
                            playerState,
                            expeditionId,
                        );
                        break;
                    case CardRarityEnum.Rare:
                        await this.incrMaxHp(10, playerState, expeditionId);
                        break;
                    case CardRarityEnum.Legendary:
                        await this.incrMaxHp(20, playerState, expeditionId);
                        break;
                }
                break;
        }
    }

    private rarityToOverrideKey(rarity: CardRarityEnum): string {
        switch (rarity) {
            case CardRarityEnum.Starter:
                return 'starter';
            case CardRarityEnum.Common:
                return 'common';
            case CardRarityEnum.Uncommon:
                return 'uncommon';
            case CardRarityEnum.Rare:
                return 'rare';
            case CardRarityEnum.Legendary:
                return 'legendary';
            case CardRarityEnum.Special:
                return 'epic';
        }
        return null;
    }
}
