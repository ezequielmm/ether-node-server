import { Injectable } from '@nestjs/common';
import { healEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { Context } from 'src/game/components/interfaces';

export interface HealArgs {
    value: number;
}

@EffectDecorator({
    effect: healEffect,
})
@Injectable()
export class HealEffect implements EffectHandler {
    constructor(private readonly playerService: PlayerService) {}

    async handle(payload: EffectDTO<HealArgs>): Promise<void> {
        const {
            client,
            expedition,
            target,
            args: { currentValue },
        } = payload;

        const ctx: Context = {
            client,
            expedition: expedition as ExpeditionDocument,
        };

        if (EffectService.isPlayer(target))
            await this.playerService.setHp(ctx, currentValue);
    }
}
