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
    userGear: Gear[] = [],
  ): Promise<Gear[]> {
    console.log('Starting to generate lootbox...');
    const gear_list: Gear[] = [];
    const uniqueGearIds: Set<string> = new Set();
  
    userGear.forEach((gear) => uniqueGearIds.add(gear.gearId.toString()));
  
    console.log(`Initial unique gear IDs: ${Array.from(uniqueGearIds).join(', ')}`);
  
    let itemsAdded = 0;
    let maxRerolls = 1;
    let rerolls = 0;
    while (itemsAdded < size) {
      let targetRarity = this.selectRandomRarity(rarities);
      console.log(`Selected target rarity: ${targetRarity} from rarity obj `);
      console.log(rarities);
      
      let targetGearSet = 'Siege';
  
      try {
        const newGear = await this.getRandomGearByRarityAndSet(targetRarity, targetGearSet, uniqueGearIds);
        if (newGear) {
          if (!uniqueGearIds.has(newGear.gearId.toString())) {
            console.log(`Found new gear with ID: ${newGear.gearId} and rarity: ${targetRarity}`);
            gear_list.push(newGear);
            uniqueGearIds.add(newGear.gearId.toString());
            itemsAdded++;
          } else {
           
            console.log(`Duplicate gear found. Re-rolling...`);
            // If the rarity is Common, reroll instead of downgrade
            if (targetRarity === GearRarityEnum.Common) {
              console.log('Rerolling within Common rarity...');
              continue; // Continue to the next iteration of the loop
            }
            // Otherwise, downgrade rarity
            targetRarity = this.downgradeRarity(targetRarity);
            if (targetRarity === null) {
              console.log('No lower rarity available. Exiting...');
              break;
            }
          }

          console.log("Target rarity: " + targetRarity);
        }
        if(rerolls > maxRerolls)
        {
            console.log("Max rerolls reached, break loop");
            break;
        }
        rerolls++;

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
  async getRandomGearByRarityAndSet(rarity: GearRarityEnum, setName: string, excludeGearIds: Set<string>): Promise<Gear | null> {
    try {
      const availableGear = await this.gearModel.find({ 
        rarity, 
        name: setName, 
        'gearId': { $nin: Array.from(excludeGearIds) } 
      });
      
      if (availableGear.length === 0) {
        return null;
      }
  
      return sample(availableGear); // Assuming you are using lodash's sample method
    } catch (error) {
      console.error(`An error occurred while fetching gear by rarity: ${rarity} and set: ${setName}`, error);
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
