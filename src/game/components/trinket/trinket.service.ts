import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrinketRarityEnum } from './trinket.enum';
import { Trinket, TrinketDocument } from './trinket.schema';

@Injectable()
export class TrinketService {
    constructor(
        @InjectModel(Trinket.name)
        private readonly trinket: Model<TrinketDocument>,
    ) {}

    async findAll(): Promise<TrinketDocument[]> {
        return this.trinket.find().lean();
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
            ],
        });
        const random = Math.floor(Math.random() * count);
        return this.trinket
            .find({
                $and: [
                    {
                        $or: [
                            { rarity: TrinketRarityEnum.Common },
                            { rarity: TrinketRarityEnum.Uncommon },
                            { rarity: TrinketRarityEnum.Rare },
                        ],
                    },
                ],
            })
            .limit(limit)
            .skip(random);
    }
}
