import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Potion, PotionDocument } from './potion.schema';
import { FilterQuery, Model } from 'mongoose';
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
import { PotionRarityEnum } from './potion.enum';
import { find } from 'lodash';
import { PotionInstance } from '../expedition/expedition.interface';
import { randomUUID } from 'crypto';
import { getPotionIdField, PotionId } from './potion.type';
import { getRandomNumber } from 'src/utils';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { CombatQueueService } from '../combatQueue/combatQueue.service';

@Injectable()
export class PotionService {
    private readonly logger: Logger = new Logger(PotionService.name);

    constructor(
        @InjectModel(Potion.name)
        private readonly potion: Model<PotionDocument>,
        private readonly effectService: EffectService,
        private readonly playerService: PlayerService,
        private readonly expeditionService: ExpeditionService,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    async findAll(): Promise<PotionDocument[]> {
        return this.potion.find({ isActive: true }).lean();
    }

    async findByPotionId(potionId: number): Promise<PotionDocument> {
        return this.potion.findOne({ potionId });
    }

    async findById(id: PotionId): Promise<PotionDocument> {
        const field = getPotionIdField(id);
        return this.potion.findOne({ [field]: id }).lean();
    }

    async randomPotion(limit: number): Promise<Potion[]> {
        const count = await this.potion.countDocuments({
            $and: [
                {
                    $or: [
                        { rarity: PotionRarityEnum.Common },
                        { rarity: PotionRarityEnum.Uncommon },
                        { rarity: PotionRarityEnum.Rare },
                    ],
                },
                { isActive: true },
            ],
        });

        const random = getRandomNumber(count);

        return await this.potion
            .find({
                $and: [
                    {
                        $or: [
                            { rarity: PotionRarityEnum.Common },
                            { rarity: PotionRarityEnum.Uncommon },
                            { rarity: PotionRarityEnum.Rare },
                        ],
                    },
                    { isActive: true },
                ],
            })
            .limit(limit)
            .skip(random)
            .lean();
    }

    async use(
        ctx: GameContext,
        potionUniqueId: string,
        targetId: TargetId,
    ): Promise<void> {
        const potion = this.findFromInventory(ctx, potionUniqueId);

        // Check if potion is available
        if (!potion) {
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.UsePotion,
                    action: SWARAction.PotionNotInInventory,
                    data: { potionId: potionUniqueId },
                }),
            );
            throw new CustomException(
                'Potion not found',
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        const inCombat =
            ctx.expedition.currentNode.nodeType ===
            ExpeditionMapNodeTypeEnum.Combat;

        // Check if potion is usable in the current context
        if (!inCombat && !potion.usableOutsideCombat) {
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.UsePotion,
                    action: SWARAction.PotionNotUsableOutsideCombat,
                    data: { potionId: potionUniqueId },
                }),
            );
            throw new CustomException(
                `Potion can't be used outside combat`,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        const player = this.playerService.get(ctx);

        if (inCombat) {
            this.logger.debug(
                `Started combat queue for client ${ctx.client.id}`,
            );
            await this.combatQueueService.start(ctx);
        }

        // Apply potion effects
        await this.effectService.applyAll({
            ctx,
            source: player,
            effects: potion.effects,
            selectedEnemy: targetId,
        });

        if (inCombat) {
            this.logger.debug(`Ended combat queue for client ${ctx.client.id}`);
            await this.combatQueueService.end(ctx);
        }

        // Once potion is used, remove it from the player's inventory
        await this.remove(ctx, potionUniqueId);
    }

    private findFromInventory(
        ctx: GameContext,
        potionUniqueId: string,
    ): PotionInstance {
        return find(ctx.expedition.playerState.potions, { id: potionUniqueId });
    }

    public async remove(
        ctx: GameContext,
        potionUniqueId: string,
    ): Promise<void> {
        // Remove potion from player's inventory
        const potions = ctx.expedition.playerState.potions.filter(
            (potion) => potion.id !== potionUniqueId,
        );

        // Update in memory state
        ctx.expedition.playerState.potions = potions;

        // Update in database
        await this.expeditionService.updateById(ctx.expedition._id.toString(), {
            'playerState.potions': potions,
        });

        this.logger.debug(
            `Removed Potion ${potionUniqueId} from client ${ctx.client.id}`,
        );
    }

    public async add(ctx: GameContext, potionId: number): Promise<boolean> {
        // Validate max potion count
        if (ctx.expedition.playerState.potions.length >= 3) {
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.AddPotion,
                    action: SWARAction.PotionMaxCountReached,
                    data: { potionId },
                }),
            );
            return false;
        }

        // Check if potion exists
        const potion = await this.findByPotionId(potionId);

        if (!potion) {
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.AddPotion,
                    action: SWARAction.PotionNotFoundInDatabase,
                    data: { potionId },
                }),
            );
            return false;
        }

        const potionData = potion.toObject();

        await this.expeditionService.updateById(ctx.expedition._id.toString(), {
            $push: {
                'playerState.potions': {
                    id: randomUUID(),
                    ...potionData,
                },
            },
        });

        return true;
    }

    public async getRandomPotion(
        filter?: FilterQuery<Potion>,
        amount = 1,
    ): Promise<PotionDocument> {
        const [potion] = await this.potion
            .aggregate<PotionDocument>([
                { $match: filter },
                { $sample: { size: amount } },
            ])
            .exec();

        return potion;
    }
}
