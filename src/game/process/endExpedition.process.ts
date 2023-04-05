import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { GameContext } from '../components/interfaces';
import { ScoreCalculatorService } from '../scoreCalculator/scoreCalculator.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { GearService } from '../components/gear/gear.service';
import { PlayerWinService } from '../../playerWin/playerWin.service';
import { ContestService } from '../contest/contest.service';
import { PlayerGearService } from 'src/playerGear/playerGear.service';

export interface IEndExpeditionProcessParameters {
    ctx: GameContext;
    win?: ExpeditionEndingTypeEnum;
    emit?: boolean;
}

export enum ExpeditionEndingTypeEnum {
    VICTORY = 'victory',
    DEFEAT = 'defeat',
}

@Injectable()
export class EndExpeditionProcess {
    constructor(
        @InjectPinoLogger(EndExpeditionProcess.name)
        private readonly logger: PinoLogger,
        private readonly scoreCalculatorService: ScoreCalculatorService,
        private readonly gearService: GearService,
        private readonly playerWinService: PlayerWinService,
        private readonly contestService: ContestService,
        private readonly playerGearService: PlayerGearService,
    ) {}

    private async handleVictory(ctx: GameContext, emit: boolean): Promise<void> {
        ctx.expedition.status = ExpeditionStatusEnum.Victory;
        ctx.expedition.completedAt = new Date();
        ctx.expedition.endedAt = new Date();

        const score = this.scoreCalculatorService.calculate({
            expedition: ctx.expedition,
        });
        ctx.expedition.finalScore = score;
        ctx.expedition.finalScore.lootbox = [];

        const canWin = await this.playerWinService.classCanWin(ctx.expedition.playerState.characterClass);

        if (canWin) {
            const isContestValid = await this.contestService.isValid(
                ctx.expedition.contest,
            );
    
            if (isContestValid) {
                ctx.expedition.finalScore.lootbox =
                    await this.gearService.getLootbox(
                        3,
                        ctx.expedition.playerState.lootboxRarity,
                    );
    
                // actually save the gear to the player
                await this.playerGearService.addGearToPlayer(
                    ctx.expedition.playerId,
                    ctx.expedition.finalScore.lootbox,
                );
    
                ctx.expedition.finalScore.notifyNoLoot = false;
            } else {
                ctx.expedition.finalScore.lootbox = [];
                ctx.expedition.finalScore.notifyNoLoot = true;
            }
    
            await this.playerWinService.create({
                event_id: ctx.expedition.contest.event_id,
                playerToken: ctx.expedition.playerState.playerToken,
            });    
        }

        // finalize changes and save the whole thing - expedition is DONE.
        await ctx.expedition.save();

        //message client to end combat and show score
        if (emit) 
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.ShowScore,
                    data: null,
                }),
            );
    }

    private async handleDefeat(ctx: GameContext, emit: boolean): Promise<void> {
        ctx.expedition.status = ExpeditionStatusEnum.Defeated;
        ctx.expedition.isCurrentlyPlaying = false;
        ctx.expedition.defeatedAt = new Date();
        ctx.expedition.endedAt = new Date();

        const score = this.scoreCalculatorService.calculate({
            expedition: ctx.expedition,
        });
        ctx.expedition.finalScore = score;

        await ctx.expedition.save();

        if (emit)
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.PlayerDefeated,
                    data: null,
                }),
            );
    }

    async handle({
        ctx,
        win = ExpeditionEndingTypeEnum.DEFEAT,
        emit = true
    }:IEndExpeditionProcessParameters): Promise<void> {
        const logger = this.logger.logger.child(ctx.info);

        switch (win) {
            case ExpeditionEndingTypeEnum.VICTORY:
                await this.handleVictory(ctx, emit);
                break;
            case ExpeditionEndingTypeEnum.DEFEAT:
            default:
                await this.handleDefeat(ctx, emit);
                break;
        }
    }
}