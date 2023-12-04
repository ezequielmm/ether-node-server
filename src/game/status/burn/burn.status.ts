import { Injectable } from '@nestjs/common';
import { damageEffect } from 'src/game/effects/damage/constants';
import { EffectService } from '../../effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { burn } from './constants';
import { EnemyService } from 'src/game/components/enemy/enemy.service';

@StatusDecorator({
    status: burn,
})
@Injectable()
export class BurnStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService) {}

    //- It is only executed when the attack of the enemies ends, to add one of burn to those who are burned
    async handle(dto: StatusEventDTO): Promise<void> {

        // If the enemy has the Firemonger unique:
        if(EnemyService.isEnemy(dto.target)){
            
        }

        await this.effectService.apply({
            ctx: dto.ctx,
            source: dto.source,
            target: dto.target,
            effect: {
                effect: damageEffect.name,
                args: {
                    value: dto.status.args.counter,
                    type: 'burn',
                },
            },
        });

        dto.status.args.counter++;
        dto.update(dto.status.args);
    }
}
