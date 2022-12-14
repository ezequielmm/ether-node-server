import { Injectable } from '@nestjs/common';
import { healEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { PlayerService } from 'src/game/components/player/player.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { ExpeditionEntity, GameContext } from 'src/game/components/interfaces';
import { ExpeditionEnemy } from 'src/game/components/enemy/enemy.interface';
import { ExpeditionPlayer } from 'src/game/components/player/interfaces';
export interface HealArgs {
    value: number;
    percentage: number;
}
@EffectDecorator({
    effect: healEffect,
})
@Injectable()
export class HealEffect implements EffectHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    private ctx: GameContext;
    private source: ExpeditionEntity;
    private target: ExpeditionEntity;
    private hpToAdd: number;
    private percentage: number;

    async handle(payload: EffectDTO<HealArgs>): Promise<void> {
        const {
            ctx,
            source,
            target,
            args: { currentValue: hpToAdd, percentage },
        } = payload;

        this.ctx = ctx;
        this.source = source;
        this.target = target;
        this.hpToAdd = hpToAdd;
        this.percentage = percentage;

        // hpToAdd is the amount of hp to add to the hpCurrent value

        // Here we check is the target to heal is the player
        if (PlayerService.isPlayer(target)) await this.applyHPToPlayer();

        // And here we check is the target to heal is the enemy
        if (EnemyService.isEnemy(target)) await this.applyHPToEnemy();
    }

    private async applyHPToPlayer(): Promise<void> {
        const {
            value: {
                combatState: { hpCurrent, hpMax },
            },
        } = this.target as ExpeditionPlayer;

        const newHp = this.calculateHp(hpMax, hpCurrent);

        await this.playerService.setHp(this.ctx, newHp);

        await this.sendToCombatQueue(newHp);
    }

    private async applyHPToEnemy(): Promise<void> {
        const {
            value: { hpCurrent, hpMax },
        } = this.target as ExpeditionEnemy;

        const newHp = this.calculateHp(hpMax, hpCurrent);
        console.log({ newHp });

        await this.enemyService.setHp(this.ctx, this.target.value.id, newHp);

        await this.sendToCombatQueue(newHp);
    }

    private async sendToCombatQueue(newHp: number): Promise<void> {
        await this.combatQueueService.push({
            ctx: this.ctx,
            source: this.source,
            target: this.target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Heal,
                defenseDelta: 0,
                finalDefense: 0,
                healthDelta: this.hpToAdd,
                finalHealth: newHp,
                statuses: [],
            },
        });
    }

    private calculateHp(hpMax: number, hpCurrent: number): number {
        let newHealth = hpCurrent + this.hpToAdd;

        /// Here we check if we have a percentega to check
        if (this.percentage > 0) {
            // if we have a percentage we recover the percentege of max hp
            newHealth = hpCurrent + hpCurrent * this.percentage;
        }

        return Math.floor(Math.min(hpMax, newHealth));
    }
}
