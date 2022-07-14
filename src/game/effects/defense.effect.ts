import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { defenseEffect } from './constants';
import { EffectDecorator } from './effects.decorator';
import { EffectDTO, IBaseEffect } from './effects.interface';

export interface DefenseArgs {
    useEnemies: boolean;
    useDiscardPileAsValue: boolean;
    multiplier: number;
}

@EffectDecorator({
    effect: defenseEffect,
})
@Injectable()
export class DefenseEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: EffectDTO<DefenseArgs>): Promise<void> {
        const {
            client,
            args: {
                currentValue,
                useEnemies,
                useDiscardPileAsValue,
                multiplier,
            },
        } = payload;

        let newDefense = currentValue;

        // check if the card uses the amount of enemies as
        // value to calculate the defense amount to apply
        if (useEnemies !== undefined && useEnemies) {
            const {
                data: { enemies },
            } = await this.expeditionService.getCurrentNode({
                clientId: client.id,
            });

            newDefense = currentValue * enemies.length;
        }

        // check if the card uses the amount of cards from the
        // discard pile as a value to set the defense
        if (useDiscardPileAsValue !== undefined && useDiscardPileAsValue) {
            const {
                data: {
                    player: {
                        cards: { discard },
                    },
                },
            } = await this.expeditionService.getCurrentNode({
                clientId: client.id,
            });

            const discardAmount = discard.length;

            newDefense = currentValue + discardAmount * multiplier;
        }

        await this.expeditionService.setPlayerDefense({
            clientId: client.id,
            value: newDefense,
        });
    }
}
