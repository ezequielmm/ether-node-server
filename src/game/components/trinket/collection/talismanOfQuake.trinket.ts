import { Prop } from "@typegoose/typegoose";
import { TrinketRarityEnum } from "../trinket.enum";
import { TrinketModifier } from "../trinket-modifier";
import { damageEffect } from "src/game/effects/damage/constants";
import { StatusType, StatusDirection } from "src/game/status/interfaces";
import { EffectDTO } from "src/game/effects/effects.interface";
import { EnemyService } from "../../enemy/enemy.service";
import { EffectService } from "src/game/effects/effects.service";
import { PlayerService } from "../../player/player.service";

/**
 * New Trinket
 */
export class TalismanOfQuakeTrinket extends TrinketModifier {

    @Prop({ default: 60 })
    trinketId: number;

    @Prop({ default: 'Talisman of Quake' })
    name: string;

    @Prop({ default: 'Any attack that deals 20+ damage to any enemy, deals an additional 5 damage to all enemies.' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Common })
    rarity: TrinketRarityEnum;

    @Prop({ default: 10 })
    minDamage: number;

    @Prop({ default: 5 })
    damageIncrement: number;

    @Prop({ default: StatusType.Buff })
    type: StatusType;

    @Prop({ default: StatusDirection.Outgoing })
    direction: StatusDirection;

    @Prop({ default: damageEffect.name })
    effect: string;

    mutate(dto: EffectDTO): EffectDTO {
        //console.log("Talisman of Quake executed----------------------")
        if (dto.target.type == 'enemy') {
            if (dto.args.currentValue >= this.minDamage) {

                const effectService = dto.ctx.moduleRef.get(EffectService, {
                    strict: false,
                });
                const enemyService = dto.ctx.moduleRef.get(EnemyService, {
                    strict: false,
                });
                const playerService = dto.ctx.moduleRef.get(PlayerService, {
                    strict: false,
                });

                const enemies = enemyService.getLiving(dto.ctx);
                
                const player = playerService.get(dto.ctx);
                this.trigger(dto.ctx);

                for(const enemy of enemies){
                    effectService.apply({
                        ctx: dto.ctx,
                        source: player,
                        target: enemy,
                        effect: {
                            effect: damageEffect.name,
                            args: {
                                value: this.damageIncrement,
                            },
                        },
                    });
                }

            }
        }

        return dto;
    }
}