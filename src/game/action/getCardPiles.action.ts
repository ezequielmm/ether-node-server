import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { EffectGenerator } from '../effects/EffectGenerator';
import { JsonEffect } from '../effects/effects.interface';
import { JsonStatus } from '../status/interfaces';
import { StatusGenerator } from '../status/statusGenerator';
import { sortBy } from 'lodash';

@Injectable()
export class GetCardPilesAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<{
        hand: IExpeditionPlayerStateDeckCard[];
        draw: IExpeditionPlayerStateDeckCard[];
        discard: IExpeditionPlayerStateDeckCard[];
        exhausted: IExpeditionPlayerStateDeckCard[];
        energy: number;
        energyMax: number;
    }> {
        const currentNode = await this.expeditionService.getCurrentNode({
            clientId,
        });

        if (!currentNode)
            return {
                hand: [],
                draw: [],
                discard: [],
                exhausted: [],
                energy: 0,
                energyMax: 0,
            };

        const {
            data: {
                player: {
                    cards: { hand, discard, exhausted, draw },
                    energy,
                    energyMax,
                },
            },
        } = currentNode;

        return {
            hand: hand.map((card) => {
                if (card.properties.statuses.length > 0)
                    card.properties.statuses.map((status) =>
                        this.formatStatusDescription(status),
                    );
                if (card.properties.effects.length > 0)
                    card.properties.effects.map((effect) =>
                        this.formatEffectDescription(effect),
                    );
                return card;
            }),
            draw: sortBy(draw, ['name', 'isUpgraded']),
            discard,
            exhausted,
            energy,
            energyMax,
        };
    }

    private formatStatusDescription(status: JsonStatus): JsonStatus {
        status.args.description = StatusGenerator.generateDescription(
            status.name,
            status.args.counter,
        );
        return status;
    }

    private formatEffectDescription(effect: JsonEffect): JsonEffect {
        effect.args.description = EffectGenerator.generateDescription(
            effect.effect,
            effect.args.value,
        );
        return effect;
    }
}
