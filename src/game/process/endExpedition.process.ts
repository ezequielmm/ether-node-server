import { Injectable } from '@nestjs/common';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { GameContext } from '../components/interfaces';
import { ScoreCalculatorService, ScoreResponse } from '../scoreCalculator/scoreCalculator.service';
import { StandardResponse, SWARAction, SWARMessageType } from '../standardResponse/standardResponse';
import { PlayerWinService } from '../../playerWin/playerWin.service';
import { ContestService } from '../contest/contest.service';
import { CharacterClassEnum } from '../components/character/character.enum';
import { SquiresService } from 'src/squires-api/squires.service';
import { GearService } from '../components/gear/gear.service';
import { PlayerGearService } from 'src/playerGear/playerGear.service';
import { Score } from '../components/expedition/scores';
import { InitExpeditionProcess } from './initExpedition.process';
import { Gear } from 'src/game/components/gear/gear.schema';
import { MixedRewardType, RewardType, SquiresRewardResponse, VictoryItem } from 'src/squires-api/squires.types';
import { sample } from 'lodash';
import { ILootboxRarityOdds } from '../components/gear/gear.interface';

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

    private halloweenGearsFilter = {
        gearId: {
            $gte: 500,
            $lte: 520
        },
    };

    private lootboxRarityStage1 = {
        common: 50,
        uncommon: 25,
        rare: 15,
        epic: 9,
        legendary: 1,
    };

    private lootboxRarityStage2 = {
        common: 40,
        uncommon: 20,
        rare: 25,
        epic: 13,
        legendary: 2,
    };

    private lootboxRarityVillagerStage1 = {
        common: 80,
        uncommon: 20,
        rare: 0,
        epic: 0,
        legendary: 0,
    };

    private lootboxRarityVillagerStage2 = {
        common: 60,
        uncommon: 40,
        rare: 0,
        epic: 0,
        legendary: 0,
    };

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

        //- Update the expedition status and time if ended.
        if(isLastStage){
            this.updateExpeditionStatusAndTime(ctx);
        }
    
        //- Calculate the final score
        await this.calculateStageScore(ctx, currentStage);
    
        //- Check if the player can win and if the contest is valid
        let canWin = await this.playerWinService.classCanWin(ctx.expedition.playerState.characterClass as CharacterClassEnum);
        let contestIsValid = await this.contestService.isValid(ctx.expedition.contest);
    
        //- Handle loot and rewards
        if(contestIsValid){
            await this.handleActiveEventLoot(ctx, currentStage, canWin);
        }else{
            ctx.expedition.finalScore.lootbox = [];
            ctx.expedition.finalScore.rewards = [];
            ctx.expedition.finalScore.victoryItems = [];
        }
    
        // Save the updated expedition
        await ctx.expedition.save();

        //- Start next Stage:
        if(!isLastStage){
            await this.initExpeditionService.createNextStage(ctx);
        }
    
        // Notify the client, if necessary
        if (emit) {
            isLastStage ? this.notifyClient(ctx, SWARAction.ShowScore) : this.notifyClient(ctx, SWARAction.ShowNextStage);
        }
    }

    private async calculateStageScore(ctx: GameContext, currentStage:number): Promise<void> {
        const score = await this.scoreCalculatorService.calculate({ expedition: ctx.expedition });

        ctx.expedition.stageScores[currentStage - 1] = score;
        ctx.expedition.stageScores[currentStage - 1].lootbox = [];
        ctx.expedition.stageScores[currentStage - 1].notifyNoLoot = false;

        //- Clean score so we can use it in next stage if so
        ctx.expedition.scores = new Score();
        await this.calculateFinalScore(ctx, score);
    }

    private async calculateFinalScore(ctx: GameContext, score:ScoreResponse) {

        //- All score stages plus the new score stage:
        const stageScores:ScoreResponse[] = ctx.expedition.stageScores;

        //- Merge and sum all the achievements:
        const achievementsMap = new Map<string, number>();

        stageScores.forEach(stageScore => {
            stageScore.achievements.forEach(achievement => {
                const { name, score } = achievement;
                if (achievementsMap.has(name)) {
                    const currentScore = achievementsMap.get(name) as number;
                    achievementsMap.set(name, currentScore + score);
                } else {
                    achievementsMap.set(name, score);
                }
            });
        });

        const newAchievements = Array.from(achievementsMap, ([name, score]) => ({ name, score }));
        const totalScore = stageScores.reduce((count, score) => {return count + score.totalScore}, 0); 

        const finalScore: ScoreResponse = {
            outcome: score.outcome, 
            expeditionType: score.expeditionType, 
            totalScore,
            achievements: newAchievements,
            notifyNoLoot: score.notifyNoLoot, 
            lootbox: score.lootbox,
            rewards: score.rewards,
            victoryItems: score.victoryItems
        };

        ctx.expedition.finalScore = finalScore;
    }

    // Update the expedition status and time
    private updateExpeditionStatusAndTime(ctx: GameContext) {
    
        ctx.expedition.status = ExpeditionStatusEnum.Victory;
        ctx.expedition.completedAt = new Date();
        ctx.expedition.endedAt = new Date();
    
    }

    private async handleActiveEventLoot(ctx: GameContext, currentStage:number, canWinGear:boolean) 
    {
        //- Lootbox - Gears:
        const character = ctx.expedition.playerState.characterClass as CharacterClassEnum;
        let filteredLootbox = canWinGear ? await this.getHalloweenGearVictoryItems(ctx, currentStage, character) : [];

        //- Rewards (from bridge API):
        const rewards = await this.squiresService.getAccountRewards(ctx.expedition.userAddress, ctx.expedition.playerState.equippedGear, character, currentStage);
        
        const potionAndTrinketReward = rewards.filter(reward => reward.type === RewardType.Potion || reward.type === RewardType.Trinket);
        const treasureReward = rewards.filter(reward => reward.type === RewardType.Fragment);
        const partnerReward  = rewards.filter(reward => reward.type === RewardType.Partner);

        if (potionAndTrinketReward && potionAndTrinketReward.length > 0) ctx.expedition.finalScore.victoryItems.push(this.transformRewardToVictoryItem(potionAndTrinketReward))
        if (treasureReward && treasureReward.length > 0)   ctx.expedition.finalScore.victoryItems.push(this.transformRewardToVictoryItem(treasureReward))
        if( partnerReward && partnerReward.length > 0 )    ctx.expedition.finalScore.victoryItems.push(this.transformRewardToVictoryItem(partnerReward));
        if (filteredLootbox && filteredLootbox.length > 0) ctx.expedition.finalScore.victoryItems.push(this.tranformGearToVictoryItem(filteredLootbox[0]))
    }

    private transformRewardToVictoryItem = (rewards: SquiresRewardResponse[]): (VictoryItem | null) => {
        const reward = sample(rewards) || null;

        if(reward){
            return {
                rewardType: MixedRewardType.Reward,
                name: reward.name,
                image: reward.image
            }
        }

        return null;
    }

    private tranformGearToVictoryItem = (gear: Gear): VictoryItem => {
        return {
            rewardType:     MixedRewardType.Lootbox,
            gearId:         gear.gearId,
            name:           gear.name,
            trait:          gear.trait,
            rarity:         gear.rarity,
            category:       gear.category,
            isActive:       gear.isActive,
            onlyOneAllowed: gear.onlyOneAllowed
        }
    }

    private async getHalloweenGearVictoryItems(ctx: GameContext, currentStage:number, character:CharacterClassEnum): Promise<Gear[]> {

        const isLastStage = ctx.expedition.contest.stages.length == currentStage;
        const lootboxRariry: ILootboxRarityOdds = 
            character === CharacterClassEnum.Villager 
                ? (isLastStage ? this.lootboxRarityVillagerStage2 : this.lootboxRarityVillagerStage1) 
                : (isLastStage ? this.lootboxRarityStage2 : this.lootboxRarityStage1);

        //- Getting the Halloween Gear for the whole userAddress
        const userHalloweenGear = await this.playerGearService.getHalloweenGear(ctx.expedition.userAddress);

        //- Gets one random Halloween Gear with random rarities
        const lootbox = await this.gearService.getUniqueHalloweenLoot(
            1,
            lootboxRariry,
            userHalloweenGear,
            this.halloweenGearsFilter
        );

        //- Remove repeated gears:
        const filteredLootbox = await this.filterNewLootItems(ctx, lootbox);

        if(filteredLootbox && filteredLootbox.length > 0){
            await this.playerGearService.addGearToPlayer(
                ctx.expedition.userAddress,
                filteredLootbox,
            );
        }

        if(isLastStage){
            await this.playerWinService.findLastStageWinAndUpdate(ctx.expedition.contest.event_id, ctx.expedition.playerState.playerToken, currentStage, filteredLootbox);
            
        }else{
            await this.playerWinService.create({
                event_id: ctx.expedition.contest.event_id,
                playerToken: ctx.expedition.playerState.playerToken,
                stage: currentStage,
                lootbox: filteredLootbox,
            });
        }

        return filteredLootbox;
    }
    
    // Filter out loot items that the player already has
    private async filterNewLootItems(ctx: GameContext, lootbox: Gear[]): Promise<Gear[]> {
    
        const allGear = (await this.playerWinService.getAllLootboxesByTokenId(ctx.expedition.playerState.playerToken.tokenId)).flat();
        const gearByWallet = (await this.playerWinService.getAllLootByWallet(ctx.expedition.playerState.userAddress)).flat();
        allGear.push(...gearByWallet);
    
        const filteredLootbox = lootbox.filter(lootItem => !allGear.some(allGearItem => allGearItem.gearId === lootItem.gearId));    
        return filteredLootbox;
    }
    
    // Notify the client
    private notifyClient(ctx: GameContext, action: SWARAction) {
        ctx.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.EndCombat,
                action: action,
                data: null,
            }),
        );
    }

    private async handleDefeat(ctx: GameContext, emit: boolean): Promise<void> {
        ctx.expedition.status = ExpeditionStatusEnum.Defeated;
        ctx.expedition.isCurrentlyPlaying = false;
        ctx.expedition.defeatedAt = new Date();
        ctx.expedition.endedAt = new Date();

        const score = await this.scoreCalculatorService.calculate({
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
}
