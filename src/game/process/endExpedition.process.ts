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
import { CharacterClassEnum } from '../components/character/character.enum';
import { SquiresService } from 'src/squires-api/squires.service';
import { Gear } from 'src/game/components/gear/gear.schema';
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
        private readonly squiresService:SquiresService
    ) {}

    private async handleVictory(
        ctx: GameContext,
        emit: boolean,
    ): Promise<void> {
        // Update the expedition status and time
        this.updateExpeditionStatusAndTime(ctx);
    
        // Calculate the final score
        this.calculateFinalScore(ctx);
    
        // Check if the player can win and if the contest is valid
        // let canWin = await this.playerWinService.classCanWin(ctx.expedition.playerState.characterClass as CharacterClassEnum);
        // let contestIsValid = await this.contestService.isValid(ctx.expedition.contest);
    
    
        // Force true in canWin and contestIsValid for contest sake.
         //canWin = true;
        // contestIsValid = true;
        
        // if(ctx.expedition.playerState.characterClass === "non-token-villager")
        // {
        //     canWin = false;
        // }
    
        // // Handle loot and rewards
        // await this.handleActiveEventLoot(ctx, canWin);

        await this.calculateRewards(ctx);
    
        // Save the updated expedition
        await ctx.expedition.save();
    

        // Notify the client, if necessary
        if (emit) {
            this.notifyClient(ctx);
        }
    }
    
    // Update the expedition status and time
    private updateExpeditionStatusAndTime(ctx: GameContext) {
    
        ctx.expedition.status = ExpeditionStatusEnum.Victory;
        ctx.expedition.completedAt = new Date();
        ctx.expedition.endedAt = new Date();
    
    }
    
    // Calculate the final score
    private calculateFinalScore(ctx: GameContext) {
    
        const score = this.scoreCalculatorService.calculate({
            expedition: ctx.expedition,
        });
        ctx.expedition.finalScore = score;

        
        ctx.expedition.finalScore.notifyNoLoot = false;
    
    }
    
    /*
    // Handle loot when the event is active
    private async handleActiveEventLoot(ctx: GameContext, canWin:boolean) {
    
        const userGear = await this.playerGearService.getGear(ctx.expedition.userAddress);
        
        const lootbox = await this.gearService.getLootbox(
            ctx.expedition.playerState.lootboxSize,
            ctx.expedition.playerState.lootboxRarity,
            userGear
        );
        const filteredLootbox = await this.filterNewLootItems(ctx, lootbox);
        
    
        await this.playerGearService.addGearToPlayer(
            ctx.expedition.userAddress,
            filteredLootbox,
        );
        await this.playerWinService.create({
            event_id: ctx.expedition.contest.event_id,
            playerToken: ctx.expedition.playerState.playerToken,
            lootbox: filteredLootbox,
        });
        
        if(canWin)
        {

            ctx.expedition.finalScore.lootbox = filteredLootbox;
            ctx.expedition.finalScore.rewards = await this.squiresService.getAccountRewards(ctx.expedition.userAddress, ctx.expedition.playerState.equippedGear);

        }
        else {
            ctx.expedition.finalScore.lootbox = [];
            ctx.expedition.finalScore.rewards = [];

        }
    }
    */
    // Filter out loot items that the player already has
    // private async filterNewLootItems(ctx: GameContext, lootbox: Gear[]): Promise<Gear[]> {
    
    //     const allGear = (await this.playerWinService.getAllLootboxesByTokenId(ctx.expedition.playerState.playerToken.tokenId)).flat();
    //     const gearByWallet = (await this.playerWinService.getAllLootByWallet(ctx.expedition.playerState.userAddress)).flat();
    //     allGear.push(...gearByWallet);
    
    //     const filteredLootbox = lootbox.filter(lootItem => !allGear.some(allGearItem => allGearItem.gearId === lootItem.gearId));
    
    
    //     return filteredLootbox;
    // }
    
    // Notify the client
    private notifyClient(ctx: GameContext) {
        ctx.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.EndCombat,
                action: SWARAction.ShowScore,
                data: null,
            }),
        );
    }
    
 /*
    // Handle loot and rewards
    private async handleLootAndRewards(ctx: GameContext, canWin: boolean, contestIsValid: boolean) {
        if (canWin && contestIsValid) {
            const lootbox = await this.gearService.getLootbox(
                ctx.expedition.playerState.lootboxSize,
                ctx.expedition.playerState.lootboxRarity,
                await this.playerGearService.getGear(ctx.expedition.userAddress),
            );
            const filteredLootbox = await this.filterNewLootItems(ctx, lootbox);
    
            await this.playerGearService.addGearToPlayer(
                ctx.expedition.userAddress,
                filteredLootbox,
            );
    
        }
    }*/
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
        emit = true,
    }: IEndExpeditionProcessParameters): Promise<void> {
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

    private async calculateRewards(ctx: GameContext): Promise<void> {
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
                    await this.playerWinService.create({
                        event_id: ctx.expedition.contest.event_id,
                        playerToken: ctx.expedition.playerState.playerToken
                    });
                ctx.expedition.finalScore.notifyNoLoot = false;
            }
        }
    }
}

