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
import { getRandomItemByWeight } from 'src/utils';
import { EncounterIdEnum } from './encounter.enum';
import { CardService } from '../card/card.service';
import { GameContext } from '../interfaces';
import { TrinketService } from '../trinket/trinket.service';
import {
    IExpeditionPlayerStateDeckCard,
    Player,
} from '../expedition/expedition.interface';
import { randomUUID } from 'crypto';
import { CardDescriptionFormatter } from '../../cardDescriptionFormatter/cardDescriptionFormatter';

@Injectable()
export class EncounterService {
    constructor(
        @InjectModel(Encounter)
        private readonly encounterModel: ReturnModelType<typeof Encounter>,
        private readonly expeditionService: ExpeditionService,

        private readonly cardService: CardService,
        private readonly trinketService: TrinketService,
    ) {}

    async generateEncounter(): Promise<EncounterInterface> {
        const encounterId = getRandomItemByWeight(
            [EncounterIdEnum.Nagpra, EncounterIdEnum.WillOWisp],
            [1, 1],
        );

        return {
            encounterId,
            stage: 0,
        };
    }

    async encounterChoice(client: Socket, choiceIdx: number): Promise<string> {
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
        await this.applyEffects(buttonPressed.effects, client);

        await this.updateEncounterData(
            encounterData.encounterId,
            buttonPressed.nextStage,
            client,
        );

        const data = await this.getEncounterDTO(client, playerState);

        return StandardResponse.respond({
            message_type: SWARMessageType.GenericData,
            action: DataWSRequestTypesEnum.EncounterData,
            data,
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
                case 'hp_max': //eg will o wisp
                    amount = parseInt(effect.amount);
                    await this.expeditionService.updateById(expeditionId, {
                        $inc: {
                            'playerState.hpMax': amount,
                        },
                    });
                    break;
                case 'upgrade_random_card': //eg will o wisp
                    await this.upgradeRandomCard(client, playerState);
                    break;
                case 'birdcage': //nagpra
                    await this.birdcage(ctx);
                    break;
                case 'card_add_to_library': //eg naiad
                    break;
            }
        }
    }

    private async birdcage(ctx: GameContext): Promise<void> {
        await this.trinketService.add(ctx, 2);
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
        const displayText = stage.displayText;
        const imageId = encounter.imageId;
        const answer: EncounterDTO = { imageId, displayText, buttons };
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

        const newCard = playerState.cards.map((item) => {
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
            cards: newCard,
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
}
