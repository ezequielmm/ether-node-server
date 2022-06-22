import { Injectable } from '@nestjs/common';
import { CardTargetedEnum } from '../components/card/enums';
import { ExpeditionService } from '../expedition/expedition.service';
import { Effect } from './decorators/effect.decorator';
import { DamageDTO } from './dto';
import { IBaseEffect } from './interfaces/baseEffect';

@Effect('damage')
@Injectable()
export class DamageEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DamageDTO): Promise<void> {
        // TODO: Triger damage attempted event

        for (let i = 0; i < (payload.times || 1); i++) {
            // Check targeted type
            if (payload.targeted === CardTargetedEnum.Player) {
                await this.applyDamageToPlayer(
                    payload.client_id,
                    payload.value,
                );
            } else if (payload.targeted === CardTargetedEnum.Enemy) {
                // TODO: Find enemy by id and apply damage
            } else if (payload.targeted === CardTargetedEnum.AllEnemies) {
                // TODO: Find all enemies and apply damage
            } else if (payload.targeted === CardTargetedEnum.RandomEnemy) {
                // TODO: Find random enemy and apply damage
            } else if (payload.targeted === CardTargetedEnum.None) {
                // TODO: ???
            }
        }
    }

    private async applyDamageToPlayer(
        clientId: string,
        damage: number,
    ): Promise<void> {
        // NOTE: We can get player data and hp_current in one query, but we'll do it this way for now

        // Get player defense
        const {
            data: { player },
        } = await this.expeditionService.getCurrentNodeByClientId(clientId);

        const { hp_current } =
            await this.expeditionService.getPlayerStateByClientId({
                client_id: clientId,
            });

        // Calculate damage
        const trueDamage = (player.defense || 0) - damage;

        // If damage is less or equal to 0, trigger damage negated event
        if (trueDamage <= 0) {
            // TODO: Trigger damage negated event
            return;
        }

        // Calculate new hp
        const newHp = hp_current - trueDamage;

        // If new hp is less or equal than 0,  trigger death event
        if (newHp <= 0) {
            // TODO: Trigger death effect event
            return;
        }

        // Update player hp
        await this.expeditionService.updatePlayerHp({
            client_id: clientId,
            hp: newHp,
        });
    }
}
