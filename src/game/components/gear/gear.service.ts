import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Gear } from './gear.schema';
import { GearRarityEnum } from './gear.enum';
import { getRandomBetween } from '../../../utils';
import { ILootboxRarityOdds } from './gear.interface';
import { data as gearData } from './gear.data';
import { find, sample } from 'lodash';

@Injectable()
export class GearService {
    constructor(
        @InjectModel(Gear)
        private readonly gearModel: ReturnModelType<typeof Gear>,
    ) {}

    private selectRandomRarity(rarities: ILootboxRarityOdds) {
        const { common, uncommon, rare, epic, legendary } = rarities;
        const maxThreshold = common + uncommon + rare + epic + legendary;
        const d100 = getRandomBetween(0, maxThreshold);

        let threshold = maxThreshold - legendary;

        if (legendary > 0 && d100 > threshold) {
            return GearRarityEnum.Legendary;
        }

        threshold -= epic;

        if (epic > 0 && d100 > threshold) {
            return GearRarityEnum.Epic;
        }

        threshold -= rare;

        if (rare > 0 && d100 > threshold) {
            return GearRarityEnum.Rare;
        }

        threshold -= uncommon;

        if (uncommon > 0 && d100 > threshold) {
            return GearRarityEnum.Uncommon;
        }

        return GearRarityEnum.Common;
    }

    async getLootbox(
        size: number,
        rarities?: ILootboxRarityOdds,
    ): Promise<Gear[]> {
        const gear_list: Gear[] = [];

        for (let i = 0; i < size; i++) {
            const one_gear = await this.getOneGear(
                this.selectRandomRarity(rarities),
            );
            gear_list.push(one_gear);
        }

        return gear_list;
    }

    async getOneGear(rarity: GearRarityEnum): Promise<Gear> {
        const availableGear = await this.gearModel.find({ rarity });
        return sample(availableGear);
    }

    getGearById(id: number): Gear | undefined {
        const gear =
            gearData[id].gearId == id
                ? gearData[id]
                : find(gearData, (i) => {
                      return i.gearId == id;
                  });

        return gear ?? undefined;
    }
}
