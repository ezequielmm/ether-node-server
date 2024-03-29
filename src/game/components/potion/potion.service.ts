import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Potion } from './potion.schema';
import { GameContext } from '../interfaces';
import { Document, FilterQuery } from 'mongoose';
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
import { ReturnModelType } from '@typegoose/typegoose';
import { CardService } from '../card/card.service';
import { EffectProducer } from 'src/game/effects/effects.interface';

@Injectable()
export class PotionService {
    private readonly logger: Logger = new Logger(PotionService.name);

    constructor(
        @InjectModel(Potion)
        private readonly potion: ReturnModelType<typeof Potion>,
        @Inject(forwardRef(() => EffectService))
        private readonly effectService: EffectService,
        private readonly playerService: PlayerService,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        private readonly combatQueueService: CombatQueueService,
        private readonly cardService: CardService,
    ) {}

    async findAll(): Promise<Potion[]> {
        return this.potion.find({ isActive: true }).lean();
    }

    async findByPotionId(potionId: number): Promise<Potion> {
        return this.potion.findOne({ potionId });
    }

    async findById(id: PotionId): Promise<Potion> {
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

    async use(ctx: GameContext, potionUniqueId: string, targetId: TargetId): Promise<void> {
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

        const inCombat = this.expeditionService.isPlayerInCombat(ctx);

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
            this.logger.log(
                ctx.info,
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
            producer: EffectProducer.Potion
        });

        if (inCombat) {
            this.logger.log(
                ctx.info,
                `Ended combat queue for client ${ctx.client.id}`,
            );
            await this.combatQueueService.end(ctx);

            const {
                expedition: {
                    currentNode: {
                        data: {
                            player: {
                                cards: { exhausted, hand, discard, draw },
                            },
                        },
                    },
                },
            } = ctx;

            await this.cardService.syncAllCardsByStatusMutated(ctx);
        }

        // Once potion is used, remove it from the player's inventory
        await this.remove(ctx, potionUniqueId);
    }

    private findFromInventory(ctx: GameContext, potionUniqueId: string): PotionInstance {
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

        this.logger.log(
            ctx.info,
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

        const potionData = (potion as Potion & Document).toObject();

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
    ): Promise<Potion> {
        const [potion] = await this.potion
            .aggregate<Potion>([{ $match: filter }, { $sample: { size: 1 } }])
            .exec();

        return potion;
    }
}
