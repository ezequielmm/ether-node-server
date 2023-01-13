import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { ExpeditionEntity } from 'src/game/components/interfaces';
import { ExpeditionPlayer } from 'src/game/components/player/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { damageEffect } from '../damage/constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { shieldBashEffect, shieldBashUpgradedEffect } from './constants';

@EffectDecorator({
    effect: shieldBashEffect,
})
@Injectable()
export class ShieldBashEffect implements EffectHandler {
    constructor(private readonly effectService: EffectService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const ctx = dto.ctx;
        const source = dto.source as ExpeditionPlayer;
        const target = dto.target;
        const damage = this.getDamageBasedOnEntity(source);

        await this.effectService.apply({
            ctx,
            source,
            target,
            effect: {
                effect: damageEffect.name,
                args: {
                    value: damage,
                },
            },
        });
    }

    getDamageBasedOnEntity(entity: ExpeditionEntity): number {
        if (PlayerService.isPlayer(entity)) {
            return entity.value.combatState.defense;
        } else if (EnemyService.isEnemy(entity)) {
            return entity.value.defense;
        }
    }
}

@EffectDecorator({
    effect: shieldBashUpgradedEffect,
})
@Injectable()
export class ShieldBashEffectUpgraded
    extends ShieldBashEffect
    implements EffectHandler
{
    getDamageBasedOnEntity(entity: ExpeditionEntity): number {
        return super.getDamageBasedOnEntity(entity) * 2;
    }
}
