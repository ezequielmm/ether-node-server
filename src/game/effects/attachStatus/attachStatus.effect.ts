import { Injectable } from '@nestjs/common';
import { StatusService } from 'src/game/status/status.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { attachStatusEffect } from './constants';

@EffectDecorator({
    effect: attachStatusEffect,
})
@Injectable()
export class AttachStatusEffect implements EffectHandler {
    constructor(private readonly statusService: StatusService) {}

    async handle(payload: EffectDTO): Promise<void> {
        const { ctx, source, target, args } = payload;

        await this.statusService.attach({
            ctx,
            source,
            target,
            statusName: args.statusName,
            statusArgs: args.statusArgs,
        });
    }
}
