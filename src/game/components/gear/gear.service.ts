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
        userGear: Gear[] = []  // Default value added for safety
    ): Promise<Gear[]> {
        const gear_list: Gear[] = [];
        const uniqueGearIds: Set<string> = new Set(); // To keep track of unique gearIds

        // for the mini tournament sake, this is a hardcoded earn, todo: remove it when we finish this.
        const targetGearSet = 'Siege';

        // Populate uniqueGearIds with gearIds from userGear
        userGear.forEach(gear => uniqueGearIds.add(gear.gearId.toString()));
        
        try {
            const newGear = await this.getGearByName(targetGearSet, this.selectRandomRarity(rarities));

            if (newGear) {
                if (uniqueGearIds.has(newGear.gearId.toString())) {
                    // Use a more sophisticated logging system here
                } else {
                    gear_list.push(newGear);
                }
            }

        } catch (error) {
            // Handle your error here
            console.error("An error occurred while fetching new gear", error);
        }

        return gear_list;
    }

    async getOneGear(rarity: GearRarityEnum): Promise<Gear> {
        const availableGear = await this.gearModel.find({ rarity });
        return sample(availableGear);
    }
    async getGearByName(name: string, rarity: GearRarityEnum): Promise<Gear> {
        try {
            return await this.gearModel.findOne({ name, rarity });
        } catch (error) {
            console.error(`An error occurred while fetching gear by name: ${name} and rarity: ${rarity}`, error);
            return null;
        }
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
