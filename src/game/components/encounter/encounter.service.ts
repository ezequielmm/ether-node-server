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
import { Player } from '../expedition/player';
import { CardRarityEnum, CardTypeEnum } from '../card/card.enum';
import { Node } from '../expedition/node';
import { filter, sample } from 'lodash';
import { PlayerService } from '../player/player.service';

@Injectable()
export class EncounterService {
    constructor(
        @InjectModel(Encounter)
        private readonly encounterModel: ReturnModelType<typeof Encounter>,
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly trinketService: TrinketService,
        private readonly playerService: PlayerService,
    ) { }

    async getRandomEncounter(
        excludeIfPossible?: number[],
    ): Promise<EncounterInterface> {
        const encounters = [
            EncounterIdEnum.Nagpra,
            EncounterIdEnum.WillOWisp,
            EncounterIdEnum.DancingSatyr,
            EncounterIdEnum.EnchantedForest,
            // EncounterIdEnum.TreeCarving,
            // EncounterIdEnum.Naiad,
            // EncounterIdEnum.AbandonedAltar, // [3 jan 2023] customer is not going to provide art
            // EncounterIdEnum.Rugburn, // [3 jan 2023] wont do
            // EncounterIdEnum.MossyTroll,
            // EncounterIdEnum.YoungWizard,
            // EncounterIdEnum.Oddbarks, // 11
            // EncounterIdEnum.RunicBehive,
        ];

        const safeEncounters =
            excludeIfPossible.length >= encounters.length
                ? encounters
                : filter(encounters, (e) => !excludeIfPossible.includes(e));

        return {
            encounterId: sample(safeEncounters),
            stage: 0,
        };
    }

    async generateEncounter(
        ctx: GameContext,
        node?: Node,
    ): Promise<EncounterInterface> {
        //generate encounter
        const encounter: EncounterInterface =
            node && node.private_data
                ? node.private_data
                : await this.getRandomEncounter();

        //fetch existing encounter if there is one
        const encounterData = await this.getEncounterData(ctx.client);
        if (encounterData) encounter.encounterId = encounterData.encounterId;

        return encounter;
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
        await this.applyEffects(buttonPressed.effects, ctx);

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

    // private async incrMaxHp(
    //     amount: number,
    //     playerState: Player,
    //     expeditionId: string,
    // ) {
    //     this.playerService.adjustMaxHp()
    //     if (playerState.hpMax + amount < 0) {
    //         amount = -playerState.hpMax;
    //     }
    //     await this.expeditionService.updateById(expeditionId, {
    //         $inc: {
    //             'playerState.hpMax': amount,
    //         },
    //     });
    // }

    // private async incrHp(
    //     amount: number,
    //     playerState: Player,
    //     expeditionId: string,
    // ) {
    //     if (playerState.hpCurrent + amount < 0) {
    //         amount = -playerState.hpCurrent;
    //     }
    //     if (playerState.hpCurrent + amount < playerState.hpMax) {
    //         amount = playerState.hpMax - playerState.hpCurrent;
    //     }
    //     await this.expeditionService.updateById(expeditionId, {
    //         $inc: {
    //             'playerState.hpCurrent': amount,
    //         },
    //     });
    // }

    private async applyEffects(
        effects: any[],
        ctx: GameContext,
    ): Promise<void> {
        for await (const effect of effects) {
            switch (effect.kind) {
                case 'coin': //eg nagpra
                    ctx.expedition.playerState.gold = Math.min(
                        ctx.expedition.playerState.gold +
                        parseInt(effect.amount),
                        0,
                    );
                    ctx.expedition.markModified('playerState.gold');
                    break;
                case 'lost_all_gold': //eg nagpra
                    ctx.expedition.playerState.gold = Math.min(
                        ctx.expedition.playerState.gold -
                        ctx.expedition.playerState.gold,
                        0,
                    );
                    ctx.expedition.markModified('playerState.gold');
                    break;
                case 'lost_half_gold': //eg nagpra
                    ctx.expedition.playerState.gold = Math.min(
                        ctx.expedition.playerState.gold -
                        (ctx.expedition.playerState.gold / 2),
                        0,
                    );
                    ctx.expedition.markModified('playerState.gold');
                    break;
                case 'hp_max_random': //eg will o wisp
                    const max = parseInt(effect.max);
                    const min = parseInt(effect.min);
                    await this.playerService.setMaxHPDelta(
                        ctx,
                        getRandomBetween(min, max),
                        true,
                    );
                    break;
                case 'hp_max':
                    await this.playerService.setMaxHPDelta(
                        ctx,
                        parseInt(effect.amount),
                        true,
                    );
                    break;
                case 'hit_points': //eg rug burn
                    await this.playerService.setHPDelta({
                        ctx,
                        hpDelta: parseInt(effect.amount),
                    });
                    break;
                case 'hit_points_avoid_dead': //eg cave in
                    let damage = effect.amount;
                    if (ctx.expedition.playerState.hpCurrent <= Math.abs(parseInt(damage))) {
                        damage = (-1 * (ctx.expedition.playerState.hpCurrent - 1));
                    }
                    await this.playerService.setHPDelta({
                        ctx,
                        hpDelta: parseInt(damage),
                    });
                    break;
                case 'loose_random_potion': //eg cave in
                    await this.looseRandomPotion(
                        ctx.client,
                        ctx.expedition.playerState,
                    );
                    break;
                case 'lost_recent_trinket': //eg cave in
                    await this.looseRecentTrinket(
                        ctx.client,
                        ctx.expedition.playerState,
                    );
                    break;
                case 'upgrade_random_card': //eg will o wisp
                    await this.upgradeRandomCard(
                        ctx.client,
                        ctx.expedition.playerState,
                    );
                    break;
                case 'upgrade_random_deffensivecard': //eg will o wisp
                    await this.upgradeRandomDefensiveCard(
                        ctx.client,
                        ctx.expedition.playerState,
                    );
                    break;
                case 'upgrade_random_offensivecard': //eg will o wisp
                    await this.upgradeRandomAttackCard(
                        ctx.client,
                        ctx.expedition.playerState,
                    );
                    break;
                case 'loose_random_card':
                    await this.looseRandomCard(
                        ctx.client,
                        ctx.expedition.playerState,
                    );
                    break;
                case 'card_add_to_library': //eg naiad
                    await this.cardService.addCardToDeck(
                        ctx,
                        parseInt(effect.cardId),
                    );
                    break;
                case 'choose_trinket':
                    await this.chooseTrinket(
                        ctx.client,
                        ctx.expedition.playerState,
                        parseInt(effect.amount),
                    );
                    break;
                case 'choose_card_to_sacrifice': // abandon altar
                    await this.chooseCardRemove(
                        ctx.client,
                        ctx.expedition.playerState,
                    );
                    break;
                case 'choose_card_remove': // Enchanted Forest
                    await this.chooseCardRemove(
                        ctx.client,
                        ctx.expedition.playerState,
                    );
                    break;
                case 'choose_card_upgrade': // Enchanted Forest
                    await this.chooseCardUpgrade(
                        ctx.client,
                        ctx.expedition.playerState,
                    );
                    break;
                case 'fatigue': // tree carving
                case 'imbued': // tree carving
                case 'feeble': // tree carving
                    break;
                case 'trinket':
                    switch (effect.item) {
                        case 'birdcage': //nagpra
                            await this.trinketService.add({
                                ctx,
                                trinketId: 3,
                            });
                            break;
                        case 'runic_tome': //young wizard
                            await this.trinketService.add({
                                ctx,
                                trinketId: 23,
                            });
                            break;
                        case 'pan_flute': //satyr
                            await this.trinketService.add({
                                ctx,
                                trinketId: 45,
                                trinketConflicts: [46, 47],
                            });
                            break;
                        case 'silver_pan_flute': //satyr
                            await this.trinketService.add({
                                ctx,
                                trinketId: 46,
                                trinketConflicts: [45, 47],
                            });
                            break;
                        case 'golden_pan_flute': //satyr
                            await this.trinketService.add({
                                ctx,
                                trinketId: 47,
                                trinketConflicts: [45, 46],
                            });
                            break;
                    }
                    break;
            }
        }
        // for (let i = 0; i < effects.length; i++) {
        //     const effect = effects[i];
        //     const ctx = await this.expeditionService.getGameContext(client);
        //     const expedition = ctx.expedition;
        //     const expeditionId = expedition._id.toString();
        //     const playerState = await this.expeditionService.getPlayerState({
        //         clientId: client.id,
        //     });
        //     let amount = 0;

        //     switch (effect.kind) {
        //         case 'coin': //eg nagpra
        //             amount = parseInt(effect.amount);

        //             if (playerState.gold + amount < 0) {
        //                 // no negative gold
        //                 amount = -playerState.gold;
        //             }

        //             await this.expeditionService.updateById(expeditionId, {
        //                 $inc: {
        //                     'playerState.gold': amount,
        //                 },
        //             });
        //             break;
        //         case 'hp_max_random': //eg will o wisp
        //             const max = parseInt(effect.max);
        //             const min = parseInt(effect.min);
        //             amount = getRandomBetween(min, max);
        //             await this.incrMaxHp(amount, playerState, expeditionId);
        //             break;
        //         case 'hp_max':
        //             amount = parseInt(effect.amount);
        //             await this.incrMaxHp(amount, playerState, expeditionId);
        //             break;
        //         case 'hit_points': //eg rug burn
        //             amount = parseInt(effect.amount);
        //             await this.incrHp(amount, playerState, expeditionId);
        //             break;

        //         case 'upgrade_random_card': //eg will o wisp
        //             await this.upgradeRandomCard(client, playerState);
        //             break;
        //         case 'loose_random_card':
        //             await this.looseRandomCard(client, playerState);
        //             break;
        //         case 'card_add_to_library': //eg naiad
        //             const cardId = parseInt(effect.cardId);
        //             await this.cardService.addCardToDeck(ctx, cardId);
        //             break;
        //         case 'choose_trinket':
        //             amount = parseInt(effect.amount);
        //             await this.chooseTrinket(client, playerState, amount);
        //             break;
        //         case 'choose_card_to_sacrifice': // abandon altar
        //             await this.chooseCardRemove(client, playerState);
        //             break;
        //         case 'choose_card_remove': // Enchanted Forest
        //             await this.chooseCardRemove(client, playerState);
        //             break;
        //         case 'choose_card_upgrade': // Enchanted Forest
        //             await this.chooseCardUpgrade(client, playerState);
        //             break;
        //         case 'fatigue': // tree carving
        //         case 'imbued': // tree carving
        //         case 'feeble': // tree carving
        //             break;
        //         case 'trinket':
        //             switch (effect.item) {
        //                 case 'birdcage': //nagpra
        //                     await this.trinketService.add(ctx, 3);
        //                     break;
        //                 case 'runic_tome': //young wizard
        //                     await this.trinketService.add(ctx, 23);
        //                     break;
        //                 case 'pan_flute': //satyr
        //                     await this.trinketService.add(ctx, 45, undefined, [46,47]);
        //                     break;
        //                 case 'silver_pan_flute': //satyr
        //                     await this.trinketService.add(ctx, 46, undefined, [45,47]);
        //                     break;
        //                 case 'golden_pan_flute': //satyr
        //                     await this.trinketService.add(ctx, 47, undefined, [45,46]);
        //                     break;
        //             }
        //             break;
        //         case 'brimbles_quest': // mossy troll
        //             break;
        //     }
        // }
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

    private async upgradeRandomDefensiveCard(
        client: Socket,
        playerState: Player,
    ): Promise<void> {
        const cardIds: number[] = [];
        const probabilityWeights: number[] = [];

        for (const card of playerState.cards) {
            if (card.cardType == CardTypeEnum.Defend)
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

    private async upgradeRandomAttackCard(
        client: Socket,
        playerState: Player,
    ): Promise<void> {
        const cardIds: number[] = [];
        const probabilityWeights: number[] = [];

        for (const card of playerState.cards) {
            if (card.cardType == CardTypeEnum.Attack)
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

    private async looseRandomPotion(client: Socket, playerState: Player): Promise<void> {
        const potionsIds: number[] = [];
        const probabilityWeights: number[] = [];

        for (const potion of playerState.potions) {
            potionsIds.push(potion.potionId);
            probabilityWeights.push(1);
        }

        if (potionsIds.length == 0) return; // no potions

        const looseMePotionId = getRandomItemByWeight(
            potionsIds,
            probabilityWeights,
        );

        console.log("Potion to loose:")
        console.log(looseMePotionId)

        await this.loosePotion(looseMePotionId, playerState, client);
    }

    async loosePotion(potionId: string | number, playerState: Player, client: Socket): Promise<void> {
        let hasLostOne = false;

        const newPotions = playerState.potions.filter((item) => {
            if (item.potionId == potionId && !hasLostOne) {
                hasLostOne = true;
                return false;
            } else {
                return true;
            }
        });

        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                $set: {
                    'playerState.potions': newPotions,
                }
            });
    }

    private async looseRecentTrinket(client: Socket, playerState: Player): Promise<void> {
        const trinketsIds: number[] = [];
        const probabilityWeights: number[] = [];

        if (trinketsIds.length == 0) return; // no trinkets

        const lastTrinketsId = playerState.trinkets[trinketsIds.length -1 ].trinketId;
        
        // const looseMeTrinketId = getRandomItemByWeight(
        //     trinketsIds,
        //     probabilityWeights,
        // );

        console.log("Trinket recent to loose:")
        // console.log(looseMeTrinketId)

        await this.looseTrinket(lastTrinketsId, playerState, client);
    }

    async looseTrinket(trinketId: string | number, playerState: Player, client: Socket): Promise<void> {
        let hasLostOne = false;

        const newTrinkets = playerState.trinkets.filter((item) => {
            if (item.trinketId == trinketId && !hasLostOne) {
                hasLostOne = true;
                return false;
            } else {
                return true;
            }
        });

        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                $set: {
                    'playerState.trinkets': newTrinkets,
                }
            });
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
            expedition.currentNode?.encounterData;
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

        upgradedCardData.description =
            CardDescriptionFormatter.process(upgradedCardData);
        this.cardService.addStatusDescriptions(upgradedCardData);

        const upgradedCard: IExpeditionPlayerStateDeckCard = {
            id: randomUUID(),
            cardId: card.cardId,
            name: upgradedCardData.name,
            cardType: upgradedCardData.cardType,
            energy: upgradedCardData.energy,
            description: upgradedCardData.description,
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

    async handleUpgradeCard(client: Socket): Promise<void> {
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
        switch (effect) {
            case 'abandon_altar':
                switch (removeMe.rarity) {
                    case CardRarityEnum.Special: //abandon altar treat special as cursed
                    case CardRarityEnum.Starter:
                        break;
                    case CardRarityEnum.Common:
                        await this.playerService.setHPDelta({
                            ctx,
                            hpDelta: 5,
                        });
                        break;
                    case CardRarityEnum.Uncommon:
                        await this.playerService.setHP({
                            ctx,
                            newHPCurrent: playerState.hpMax,
                        });
                        break;
                    case CardRarityEnum.Rare:
                        await this.playerService.setMaxHPDelta(ctx, 10, true);
                        break;
                    case CardRarityEnum.Legendary:
                        await this.playerService.setMaxHPDelta(ctx, 20, true);
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
