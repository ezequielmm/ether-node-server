import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from 'src/game/standardResponse/standardResponse';
import { getRandomNumber } from 'src/utils';
import { ExpeditionService } from '../expedition/expedition.service';
import { GameContext } from '../interfaces';
import { TrinketRarityEnum } from './trinket.enum';
import { Trinket, TrinketDocument } from './trinket.schema';
import { getTrinketField, TrinketId } from './trinket.type';

@Injectable()
export class TrinketService {
    constructor(
        @InjectModel(Trinket.name)
        private readonly trinket: Model<TrinketDocument>,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async findAll(): Promise<TrinketDocument[]> {
        return this.trinket.find({ isActive: true }).lean();
    }

    async findById(id: TrinketId): Promise<TrinketDocument> {
        const field = getTrinketField(id);
        return this.trinket.findOne({ [field]: id }).lean();
    }

    async randomTrinket(limit: number): Promise<TrinketDocument[]> {
        const count = await this.trinket.countDocuments({
            $and: [
                {
                    $or: [
                        { rarity: TrinketRarityEnum.Common },
                        { rarity: TrinketRarityEnum.Uncommon },
                        { rarity: TrinketRarityEnum.Rare },
                    ],
                },
                { isActive: true },
            ],
        });

        const random = getRandomNumber(count);

        return await this.trinket
            .find({
                $and: [
                    {
                        $or: [
                            { rarity: TrinketRarityEnum.Common },
                            { rarity: TrinketRarityEnum.Uncommon },
                            { rarity: TrinketRarityEnum.Rare },
                        ],
                    },
                    { isActive: true },
                ],
            })
            .limit(limit)
            .skip(random);
    }

    async findOneRandomTrinket(rarity: string): Promise<TrinketDocument> {
        const count = await this.trinket.countDocuments({ rarity });
        const random = getRandomNumber(count);
        const trinket = await this.trinket
            .find({ rarity, isActive: true })
            .limit(1)
            .skip(random);

        return trinket[0] ? trinket[0] : null;
    }

    public async add(ctx: GameContext, trinketId: number): Promise<boolean> {
        const trinket = await this.findById(trinketId);

        if (!trinket) {
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.AddTrinket,
                    action: SWARAction.TrinketNotFoundInDatabase,
                    data: { trinketId },
                }),
            );
            return false;
        }

        await this.expeditionService.updateById(ctx.expedition.id, {
            $push: {
                'playerState.trinkets': {
                    id: randomUUID(),
                    ...trinket,
                },
            },
        });

        return true;
    }
}
