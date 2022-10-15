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
<<<<<<< HEAD
import { CardRarityEnum } from '../card/card.enum';
import { PotionRarityEnum } from './potion.enum';
=======
import { find } from 'lodash';
import { PotionInstance } from '../expedition/expedition.interface';
import { randomUUID } from 'crypto';
>>>>>>> develop

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
        return this.potion.findOne({ potionId });
    }
    async randomPotion(limit: number): Promise<PotionDocument[]> {
        const count = await this.potion.countDocuments({
            $and: [
                {
                    $or: [
                        { rarity: PotionRarityEnum.Common },
                        { rarity: PotionRarityEnum.Uncommon },
                        { rarity: PotionRarityEnum.Rare },
                    ],
                },
            ],
        });
        const random = Math.floor(Math.random() * count);
        return this.potion
            .find({
                $and: [
                    {
                        $or: [
                            { rarity: CardRarityEnum.Common },
                            { rarity: CardRarityEnum.Uncommon },
                            { rarity: CardRarityEnum.Rare },
                        ],
                    },
                ],
            })
            .limit(limit)
            .skip(random);
    }

    async use(
        ctx: GameContext,
        instanceId: string,
        targetId: TargetId,
    ): Promise<void> {
        const potionInstance = this.findFromInventory(ctx, instanceId);

        // Check if potion is available
        if (!potionInstance) {
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.UsePotion,
                    action: SWARAction.PotionNotInInventory,
                    data: { potionId: instanceId },
                }),
            );
            return;
        }

        const { potion } = potionInstance;

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
                    data: { potionId: instanceId },
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
        await this.remove(ctx, instanceId);
    }

    private findFromInventory(
        ctx: GameContext,
        instanceId: string,
    ): PotionInstance {
        return find(ctx.expedition.playerState.potions, { id: instanceId });
    }

    public async remove(ctx: GameContext, instanceId: string): Promise<void> {
        // Remove potion from player's inventory
        const potions = ctx.expedition.playerState.potions.filter(
            (potion) => potion.id !== instanceId,
        );

        // Update in memory state
        ctx.expedition.playerState.potions = potions;

        // Update in database
        await this.expeditionService.updateById(ctx.expedition._id, {
            'playerState.potions': potions,
        });
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

        // remove _id and __v from potion
        const { _id, __v, ...potionData } = potion.toObject();

        await this.expeditionService.updateById(ctx.expedition._id, {
            $push: {
                'playerState.potions': {
                    id: randomUUID(),
                    potion: potionData,
                },
            },
        });

        return true;
    }

    public async getRandomPotion(): Promise<PotionDocument> {
        const [potion] = await this.potion
            .aggregate<PotionDocument>([{ $sample: { size: 1 } }])
            .exec();

        return potion;
    }
}
