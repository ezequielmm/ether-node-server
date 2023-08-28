import { Injectable } from '@nestjs/common';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { GameContext } from '../components/interfaces';
import { ScoreCalculatorService } from '../scoreCalculator/scoreCalculator.service';
import { StandardResponse, SWARAction, SWARMessageType } from '../standardResponse/standardResponse';
import { PlayerWinService } from '../../playerWin/playerWin.service';
import { ContestService } from '../contest/contest.service';
import { CharacterClassEnum } from '../components/character/character.enum';
import { SquiresService } from 'src/squires-api/squires.service';
import { GearService } from '../components/gear/gear.service';
import { PlayerGearService } from 'src/playerGear/playerGear.service';
import { Score } from '../components/expedition/scores';
import { InitExpeditionProcess } from './initExpedition.process';

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
        private readonly scoreCalculatorService: ScoreCalculatorService,
        private readonly playerWinService: PlayerWinService,
        private readonly contestService: ContestService,
        private readonly squiresService:SquiresService,
        private readonly gearService:GearService,
        private readonly playerGearService:PlayerGearService,
        private readonly initExpeditionService:InitExpeditionProcess,
    ) {}

    public async handle({ ctx, win = ExpeditionEndingTypeEnum.DEFEAT, emit = true }: IEndExpeditionProcessParameters): Promise<void> {
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

    private async handleVictory(ctx: GameContext, emit: boolean): Promise<void> {

        const currentStage = ctx.expedition.currentStage;
        const isLastStage = ctx.expedition.contest.stages.length == currentStage;

        if(isLastStage){
            //- End of Expedition:
            ctx.expedition.status = ExpeditionStatusEnum.Victory;
            ctx.expedition.completedAt = new Date();
            ctx.expedition.endedAt = new Date();

            await this.calculateStageScore(ctx, currentStage);

            //- todo: We'll be need to calculate de total final score adding all stages scores:
            // ctx.expedition.finalScore = score;
            // ctx.expedition.finalScore.lootbox = [];
            // ctx.expedition.finalScore.notifyNoLoot = false;

            await this.calculateRewards(ctx, isLastStage);
            await ctx.expedition.save();

            //- Message client to end combat and show score
            if (emit){
                ctx.client.emit(
                    'PutData',
                    StandardResponse.respond({
                        message_type: SWARMessageType.EndCombat,
                        action: SWARAction.ShowScore,
                        data: null,
                    }),
                );
            }

        }else{
            
            //- Continue Expedition with the next stage:
            await this.calculateStageScore(ctx, currentStage);
            await this.calculateRewards(ctx, isLastStage);
            await ctx.expedition.save();

            //- devolver esto como data no serviría? para ahorrar otra invocacion....
            //devolver el expedition o el context entero no se.

            // si lo de arriba no es posible, el siguiente stage tendrá que ser creado cuando unity invoque un nuevo metodo.
            // pero en caso de que lo de arriba sea posible ya voy creando la siguiente stage:
            await this.initExpeditionService.createNextStage(ctx);

            //- Message client to end combat and show score
            if (emit){
                ctx.client.emit(
                    'PutData',
                    StandardResponse.respond({
                        message_type: SWARMessageType.EndCombat,
                        action: SWARAction.ShowNextStage,
                        data: null,
                    }),
                );
            }
        }
    }

    private async calculateStageScore(ctx: GameContext, currentStage:number): Promise<void> {
        const score = this.scoreCalculatorService.calculate({ expedition: ctx.expedition });

        ctx.expedition.stageScores[currentStage - 1] = score;
        ctx.expedition.stageScores[currentStage - 1].lootbox = [];
        ctx.expedition.stageScores[currentStage - 1].notifyNoLoot = false;

        //- Clean score so we can use it in next stage if so
        ctx.expedition.scores = new Score();
    }

    private async calculateRewards(ctx: GameContext, isLastStage:boolean): Promise<void> {
        const canWin = await this.playerWinService.classCanWin(ctx.expedition.playerState.characterClass as CharacterClassEnum);
        const contestIsValid = await this.contestService.isValid(ctx.expedition.contest);

        if (canWin) {
            ctx.expedition.finalScore.notifyNoLoot = true;

            if (contestIsValid) {
                //------------------------------------------------------------------------------------------
                //- Lootbox when event not Active:
                ctx.expedition.finalScore.rewards = await this.squiresService.getAccountRewards(ctx.expedition.userAddress, ctx.expedition.playerState.equippedGear);
                //------------------------------------------------------------------------------------------
                
                //------------------------------------------------------------------------------------------
                //- Lootbox when event Active. Following 2 blocks:
                
                // ctx.expedition.finalScore.lootbox = await this.gearService.getLootbox
                //     (
                //         ctx.expedition.playerState.lootboxSize,
                //         ctx.expedition.playerState.lootboxRarity,
                //     );

                // await this.playerGearService.addGearToPlayer(
                //     ctx.expedition.userAddress,
                //     ctx.expedition.finalScore.lootbox,
                // );
                //------------------------------------------------------------------------------------------

                if(isLastStage){
                    await this.playerWinService.create({
                        event_id: ctx.expedition.contest.event_id,
                        playerToken: ctx.expedition.playerState.playerToken
                    });
                }

                ctx.expedition.finalScore.notifyNoLoot = false;
            }
        }
    }

    private async handleDefeat(ctx: GameContext, emit: boolean): Promise<void> {
        ctx.expedition.status = ExpeditionStatusEnum.Defeated;
        ctx.expedition.isCurrentlyPlaying = false;
        ctx.expedition.defeatedAt = new Date();
        ctx.expedition.endedAt = new Date();

        //- todo: Same as above. This scores shpould be calculated with all the scores from the different stages:
        const score = this.scoreCalculatorService.calculate({ expedition: ctx.expedition });

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
}

