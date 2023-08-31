import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Gear } from './gear.schema';
import { GearRarityEnum } from './gear.enum';
import { getDecimalRandomBetween } from '../../../utils';
import { ILootboxRarityOdds } from './gear.interface';
import { data as GearData } from './gear.data';
import { find, sample } from 'lodash';
enum Rarity {
    Common = 'Common',
    Uncommon = 'Uncommon',
    Rare = 'Rare',
    Epic = 'Epic',
    Legendary = 'Legendary'
  }
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
    userGear: Gear[] = [], // Default value added for safety
  ): Promise<Gear[]> {
    console.log('Starting to generate lootbox...');  // Added log
    const gear_list: Gear[] = [];
    const uniqueGearIds: Set<string> = new Set();

    userGear.forEach((gear) => uniqueGearIds.add(gear.gearId.toString()));
    
    console.log(`Initial unique gear IDs: ${Array.from(uniqueGearIds).join(', ')}`);  // Added log

    let targetRarity = this.selectRandomRarity(rarities);
    console.log(`Initial target rarity: ${targetRarity}`);  // Added log
    
    let targetGearSet = 'Siege';

    while (true) {
      try {
        const newGear = await this.getGearByName(targetGearSet, targetRarity);
        if (newGear) {
          if (!uniqueGearIds.has(newGear.gearId.toString())) {
            console.log(`Found new gear with ID: ${newGear.gearId} and rarity: ${targetRarity}`);  // Added log
            gear_list.push(newGear);
            break;
          } else {
            console.log(`Duplicate gear found. Downgrading rarity...`);  // Added log
            targetRarity = this.downgradeRarity(targetRarity);
            if (targetRarity === null) {
              console.log('No lower rarity available. Exiting...');  // Added log
              break;
            }
          }
        }
      } catch (error) {
        console.error('An error occurred while fetching new gear', error);
        break;
      }
    }

    return gear_list;
  }

  private downgradeRarity(
    currentRarity: GearRarityEnum,
  ): GearRarityEnum | null {
    console.log(`Current rarity: ${currentRarity}. Attempting to downgrade...`);  // Added log

    switch (currentRarity) {
      case GearRarityEnum.Legendary:
        console.log(`Downgraded from Legendary to Epic`);  // Added log
        return GearRarityEnum.Epic;
      case GearRarityEnum.Epic:
        console.log(`Downgraded from Epic to Rare`);  // Added log
        return GearRarityEnum.Rare;
      case GearRarityEnum.Rare:
        console.log(`Downgraded from Rare to Uncommon`);  // Added log
        return GearRarityEnum.Uncommon;
      case GearRarityEnum.Uncommon:
        console.log(`Downgraded from Uncommon to Common`);  // Added log
        return GearRarityEnum.Common;
      default:
        console.log('No lower rarity available');  // Added log
        return null;
    }
  }
  async getOneGear(rarity: GearRarityEnum): Promise<Gear> {
    const availableGear = await this.gearModel.find({ rarity });
    return sample(availableGear);
  }
  async getGearByName(name: string, rarity: GearRarityEnum): Promise<Gear> {
    try {
      return await this.gearModel.findOne({ name, rarity });
    } catch (error) {
      console.error(
        `An error occurred while fetching gear by name: ${name} and rarity: ${rarity}`,
        error,
      );
      return null;
    }
  }
  getGearById(id: number): Gear | undefined {
    if (
      this.gearData[id] &&
      this.gearData[id].gearId &&
      this.gearData[id].gearId == id
    )
      return this.gearData[id];

    const gear = find(this.gearData, (i) => {
      return i.gearId == id;
    });

    return gear;
  }
}
