import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Gear } from './gear.schema';
import { GearRarityEnum } from './gear.enum';
import { getDecimalRandomBetween } from '../../../utils';
import { ILootboxRarityOdds } from './gear.interface';
import { data as GearData } from './gear.data';
import { find, sample } from 'lodash';

@Injectable()
export class GearService {
    constructor(
        @InjectModel(Gear)
        private readonly gearModel: ReturnModelType<typeof Gear>,
    ) {}

    private gearData = GearData;

    private selectRandomRarity(rarities: ILootboxRarityOdds) {
        const { common, uncommon, rare, epic, legendary } = rarities;
        const maxThreshold = common + uncommon + rare + epic + legendary;
        const d100 = getDecimalRandomBetween(0, maxThreshold);

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
        if (this.gearData[id] 
            && this.gearData[id].gearId 
            && this.gearData[id].gearId == id) return this.gearData[id];

        const gear = find(this.gearData, (i) => {
                      return i.gearId == id;
                     });

        return gear;
    }
}
