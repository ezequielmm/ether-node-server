import { Injectable } from '@nestjs/common';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { birdcageStatus } from './constants';
import { EffectService } from 'src/game/effects/effects.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { damageEffect } from 'src/game/effects/damage/constants';
import { CardTypeEnum } from 'src/game/components/card/card.enum';
import { EnemyService } from 'src/game/components/enemy/enemy.service';

@StatusDecorator({
    status: birdcageStatus,
})
@Injectable()
export class BirdcageStatus implements StatusEventHandler {
    constructor(
        private readonly enemyService: EnemyService,
        private readonly playerService: PlayerService,
        private readonly effectService: EffectService,
    ) {}
    async handle(dto: StatusEventDTO): Promise<any> {
        const {
            ctx,
            status: { args },
            eventArgs: {
                card: { cardType },
            },
        } = dto;
        if (cardType === CardTypeEnum.Attack) {
            args.counter--;

            if (args.counter <= 0) {
                const player = this.playerService.get(ctx);

                const enemy = this.enemyService.getRandom(ctx);

                await this.effectService.apply({
                    ctx,
                    source: player,
                    target: enemy,
                    effect: {
                        effect: damageEffect.name,
                        args: {
                            value: args.value,
                        },
                    },
                });

                dto.remove();
            } else {
                dto.update(args);
            }
        }
    }
}
