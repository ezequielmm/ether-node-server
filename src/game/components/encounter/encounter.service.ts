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
import { EncounterInterface } from './encounter.interfaces';
import { EncounterDTO } from '../../action/getEncounterDataAction';
import { DataWSRequestTypesEnum } from '../../../socket/socket.enum';
import { ReturnModelType } from '@typegoose/typegoose';
import { getRandomItemByWeight } from 'src/utils';
import { EncounterIdEnum } from './encounter.enum';
import { CardService } from '../card/card.service';
import { GameContext } from '../interfaces';
import { TrinketService } from '../trinket/trinket.service';

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

        const data = await this.getEncounterDTO(client);

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
            let amount = 0;

            switch (effect.kind) {
                case 'coin': //eg nagpra
                    const playerState =
                        await this.expeditionService.getPlayerState({
                            clientId: client.id,
                        });
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
                    await this.upgradeRandomCard(client);
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

    private async upgradeRandomCard(client: Socket): Promise<void> {
        const {
            playerState,
            playerState: { cards },
            currentNode: { merchantItems },
        } = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const data = {
            upgradeableCards: [],
        };

        const cardIds: number[] = [];
        const probabilityWeights: number[] = [];

        for (const card of cards) {
            if (!card.isUpgraded) {
                data.upgradeableCards.push(card);
                cardIds.push(card.upgradedCardId);
                probabilityWeights.push(1);
            }
        }

        const upgradedCards = await this.cardService.findCardsById(cardIds);
        const upgradedCardData = getRandomItemByWeight(
            upgradedCards,
            probabilityWeights,
        );

        //see MerchantService
    }

    async getByEncounterId(encounterId: number): Promise<Encounter> {
        const encounter = await this.encounterModel
            .findOne({ encounterId })
            .exec();
        return encounter;
    }

    async getEncounterDTO(client: Socket): Promise<EncounterDTO> {
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
            const enabled = true;
            const text = stage.buttons[i].text;
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
}
