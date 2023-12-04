import { Injectable } from '@nestjs/common';
import { damageEffect } from 'src/game/effects/damage/constants';
import { EffectService } from '../../effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { burn } from './constants';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { EnemyUnique } from 'src/game/components/enemy/enemy.enum';
import { healEffect } from 'src/game/effects/heal/constants';

@StatusDecorator({
    status: burn,
})
@Injectable()
export class BurnStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService) {}

    //- It is only executed when the attack of the enemies ends, to add one of burn to those who are burned
    async handle(dto: StatusEventDTO): Promise<void> {

        // If the enemy has the Firemonger unique:
        if(EnemyService.isEnemyUniqueType(dto.target, EnemyUnique.Firemonger)){
            console.log("A FireMonger enemy with burn status")
            await this.effectService.apply({
                ctx: dto.ctx,
                source: dto.source,
                target: dto.target,
                effect: {
                    effect: healEffect.name,
                    args: {
                        value: dto.status.args.counter,
                        type: 'burn',
                    },
                },
            });
        }else{
            console.log("None FireMonger enemy with burn status")
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
}
