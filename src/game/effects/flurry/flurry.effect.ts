import { damageEffect } from '../damage/constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { flurry } from './constants';

@EffectDecorator({
    effect: flurry,
})
export class FlurryEffect implements EffectHandler {
    constructor(private readonly effectService: EffectService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { client, expedition, source, target } = dto;
        const energy = expedition.currentNode.data.player.energy;

        for (let i = 0; i < energy; i++) {
            await this.effectService.apply({
                client,
                expedition,
                source,
                target,
                effect: {
                    effect: damageEffect.name,
                    args: {
                        value: dto.args.currentValue,
                    },
                },
            });
        }
    }
}
