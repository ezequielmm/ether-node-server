import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Potion, PotionDocument } from './potion.schema';
import { Model } from 'mongoose';
import { GameContext } from '../interfaces';
import { ExpeditionMapNodeTypeEnum } from '../expedition/expedition.enum';
import { EffectService } from 'src/game/effects/effects.service';
import { PlayerService } from '../player/player.service';
import { ExpeditionService } from '../expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { TargetId } from 'src/game/effects/effects.types';

@Injectable()
export class PotionService {
    constructor(
        @InjectModel(Potion.name)
        private readonly potion: Model<PotionDocument>,
        private readonly effectService: EffectService,
        private readonly playerService: PlayerService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async findAll(): Promise<PotionDocument[]> {
        return this.potion.find().lean();
    }

    async findByPotionId(potionId: number): Promise<PotionDocument> {
        return this.potion.findOne({ potionId }).lean();
    }

    async use(
        ctx: GameContext,
        potionId: number,
        targetId: TargetId,
    ): Promise<void> {
        const isInInventory = this.isInInventory(ctx, potionId);

        // Check if potion is available
        if (!isInInventory) {
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.PotionNotInInventory,
                    action: SWARAction.ShowInvalidPotion,
                    data: { potionId },
                }),
            );
            return;
        }

        // Get potion info
        const potion = await this.findByPotionId(potionId);

        const inCombat =
            ctx.expedition.currentNode.nodeType !==
            ExpeditionMapNodeTypeEnum.Combat;

        // Check if potion is usable in the current context
        if (!inCombat && potion.usableOutsideCombat) {
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.PotionNotUsableOutsideCombat,
                    action: SWARAction.ShowInvalidPotion,
                    data: { potionId },
                }),
            );
            return;
        }

        const player = this.playerService.get(ctx);

        // Apply potion effects
        await this.effectService.applyAll({
            ctx,
            source: player,
            effects: potion.effects,
            selectedEnemy: targetId,
        });

        // Once potion is used, remove it from the player's inventory
        await this.remove(ctx, potionId);
    }

    private isInInventory(ctx: GameContext, potionId: number) {
        return ctx.expedition.playerState.potions.find((id) => id === potionId);
    }

    public async remove(ctx: GameContext, potionId: number): Promise<void> {
        // Remove potion from player's inventory
        const potions = ctx.expedition.playerState.potions.filter(
            (id) => id !== potionId,
        );

        // Update in memory state
        ctx.expedition.playerState.potions = potions;

        // Update in database
        await this.expeditionService.updateById(ctx.expedition._id, {
            'playerState.potions': potions,
        });
    }

    public async add(ctx: GameContext, potionId: number): Promise<void> {
        // Validate max potion count
        if (ctx.expedition.playerState.potions.length >= 3) {
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.PotionMaxCountReached,
                    action: SWARAction.ShowInvalidPotion,
                    data: { potionId },
                }),
            );
            return;
        }

        // Check if potion exists
        const potion = await this.findByPotionId(potionId);

        if (!potion) {
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.PotionNotFoundInDatabase,
                    action: SWARAction.ShowInvalidPotion,
                    data: { potionId },
                }),
            );
            return;
        }

        await this.expeditionService.updateById(ctx.expedition._id, {
            playerState: {
                potions: [...ctx.expedition.playerState.potions, potionId],
            },
        });
    }

    public async getRandomPotion(): Promise<PotionDocument> {
        const [potion] = await this.potion
            .aggregate<PotionDocument>([{ $sample: { size: 1 } }])
            .exec();

        return potion;
    }
}
