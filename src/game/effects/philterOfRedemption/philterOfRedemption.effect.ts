import { Injectable } from '@nestjs/common';
import { HistoryService } from 'src/game/history/history.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { filter, sumBy } from 'lodash';
import { EffectService } from '../effects.service';
import { healEffect } from '../heal/constants';
import { philterOfRedemptionEffect } from './constants';

@EffectDecorator({
    effect: philterOfRedemptionEffect,
})
@Injectable()
export class PhilterOfRedemptionEffect implements EffectHandler {
    constructor(
        private readonly effectService: EffectService,
        private readonly historyService: HistoryService,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const {
            ctx,
            source,
            ctx: {
                expedition: {
                    currentNode: {
                        data: { round },
                    },
                },
            },
        } = dto;

        const damages = filter(this.historyService.get(ctx.client.id), {
            type: 'damage',
            turn: Math.max(round - 1, 1),
        });

        if (damages.length > 0) {
            const totalToRecover = sumBy(damages, 'damage');

            if (totalToRecover > 0) {
                await this.effectService.apply({
                    ctx,
                    source,
                    target: source,
                    effect: {
                        effect: healEffect.name,
                        args: {
                            value: totalToRecover,
                        },
                    },
                }).finally(() => {
                });
            }
            else {
            }
        }
        else {
            console.log("There are no damages so potion wont work");
        }

    }
}
