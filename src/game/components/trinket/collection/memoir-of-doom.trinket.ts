import { Prop } from "@typegoose/typegoose";
import { TrinketRarityEnum } from "../trinket.enum";
import { Trinket } from "../trinket.schema";
import { resolveStatus } from "src/game/status/resolve/constants";
import { EVENT_ENEMY_DEAD } from "src/game/constants";
import { StatusService } from "src/game/status/status.service";
import { GameContext } from "../../interfaces";
import { PlayerService } from "../../player/player.service";
import { CombatQueueTargetEffectTypeEnum } from "../../combatQueue/combatQueue.enum";
import { CombatQueueService } from "../../combatQueue/combatQueue.service";

export class MemoirOfDoomTrinket extends Trinket{

    @Prop({ default: 61 })
    trinketId: number;

    @Prop({ default: 'Memoir of Doom' })
    name: string;

    @Prop({ default: 'Gain 2 resolve and 10 defense every time an enemy is defeated.' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Common })
    rarity: TrinketRarityEnum;

    @Prop({ default: 2 })
    resolveToGain: number;

    @Prop({ default: 10 })
    defenseToGain: number;

    async onAttach(ctx: GameContext): Promise<void> {
        ctx.events.addListener(EVENT_ENEMY_DEAD, async () => {

            const statusService = ctx.moduleRef.get(StatusService, {
                strict: false,
            });

            const playerService = ctx.moduleRef.get(PlayerService, {
                strict: false,
            });

            const combatQueueService = ctx.moduleRef.get(CombatQueueService, {
                strict: false,
            });

            const player = playerService.get(ctx);
            const newDefense = player.value.combatState.defense += 10;

            await statusService.attach({
                ctx,
                source: player,
                target: player,
                statusName: resolveStatus.name,
                statusArgs: {
                    counter: this.resolveToGain
                },
            });

            await combatQueueService.push({
                ctx,
                source: player,
                target: player,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Status,
                    statuses: [],
                },
            });

            await combatQueueService.push({
                ctx,
                source: player,
                target: player,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Defense,
                    defenseDelta: 10,
                    finalDefense: newDefense,
                    healthDelta: 0,
                    finalHealth: 0,
                    statuses: [],
                },
            });

            playerService.setDefense(ctx, newDefense);

            this.trigger(ctx);
        });
    }
}