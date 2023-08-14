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

    async handle(dto: StatusEventDTO): Promise<void> {
        const { ctx, status: { args },
            eventArgs: {
                card: { cardType },
            },
        } = dto;

        if (cardType === CardTypeEnum.Attack) 
        {
            const timesHitted = this.getTimesHitted(dto);
            let birdcageEffectTimes = 0;
            
            let hits = timesHitted;
            if(timesHitted >= args.counter){
                hits = timesHitted - args.counter;
                birdcageEffectTimes = 1 + Math.floor((hits / 4));
                if(hits < 4)
                    args.counter = (4 - hits);
                else
                    args.counter = (hits % 4) > 0 ? (hits % 4) : 4;
            }else{
                args.counter -= timesHitted;
            }

            if(args.counter <= 0){
                args.counter = 4;
            }

            if (birdcageEffectTimes > 0) {
                while(birdcageEffectTimes > 0){
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
                                type: "birdcage"
                            },
                        },
                    });
    
                    //args.counter = 4;
                    birdcageEffectTimes--;
                }
                dto.update(args);
            } else {
                dto.update(args);
            }
        }
    }

    getTimesHitted(dto:StatusEventDTO) : number {
        let timesHitted = 1;

        const flurryEffect = (dto.eventArgs.card.properties.effects || []).find(effect => {
            return effect.effect === "flurry";
        });

        const flurryPlusEffect = (dto.eventArgs.card.properties.effects || []).find(effect => {
            return effect.effect === "flurry-plus";
        });

        const effectWithTimes = (dto.eventArgs.card.properties.effects || []).find(effect => {
            return effect.hasOwnProperty("times");
        });

        if(flurryEffect){
            timesHitted*=dto.ctx.expedition.currentNode?.data.player.energy;
        }
        else if(flurryPlusEffect){
            timesHitted = (timesHitted * dto.ctx.expedition.currentNode?.data.player.energy) + 1;
        }

        else if(effectWithTimes){
            timesHitted = effectWithTimes["times"];
        }

        return timesHitted;
    }
}
