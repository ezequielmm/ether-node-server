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
    const maxThreshold = (common * 10) + (uncommon * 10) + (rare * 10 ) + (epic * 10) + (legendary * 10);

    let rarityData = [{item: GearRarityEnum.Common, rate: common * 10 }, 
      {item: GearRarityEnum.Uncommon, rate: uncommon * 10 },  {item: GearRarityEnum.Rare, rate: rare * 10 },
      {item: GearRarityEnum.Epic, rate: epic * 10 },    {item: GearRarityEnum.Legendary, rate: legendary * 10 }
    ];
    let rng = Math.floor(Math.random() * maxThreshold);
    let current = 0;
    console.log("RNG ", rng);
    for(const rarityD of rarityData) {
        current += rarityD.rate;

        if(rng < current)
            return rarityD.item;
    }

    return null;

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
    
    let reroll = 0;
    let maxReroll = 1;

    let testReRoll = 30;
    for(let i = 0; i < testReRoll; i++)
    {
      console.log("Index: ", i);
      let itemsAdded = 0;
      while (itemsAdded < size) {
        let targetRarity = this.selectRandomRarity(rarities);
        if(targetRarity === null)
        {
          console.log("Null target rarity, no gear");
          break;
        }
        //console.log(`Selected target rarity: ${targetRarity} from rarity obj `);
        
        let targetGearSet = 'Siege';
    
        try {
          const newGear = await this.getRandomGearByRarityAndSet(targetRarity, targetGearSet, uniqueGearIds);
          if (newGear) {
            if (!uniqueGearIds.has(newGear.gearId.toString())) {
              //console.log(`Found new gear with ID: ${newGear.gearId} and rarity: ${targetRarity}`);
              gear_list.push(newGear);
              uniqueGearIds.add(newGear.gearId.toString());
              itemsAdded++;
              console.log("Add: ", newGear.gearId);
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
          else {
            console.log("No Gear, downgrade -->  " + targetRarity);
            if(targetRarity == GearRarityEnum.Common)
            {
              console.log("[No Common Available]");
              break;
            }
            targetRarity = this.downgradeRarity(targetRarity);
          
            continue;
          }
          if(reroll  > maxReroll)
          {
            console.log("Break Loop")
            break;
          }
          reroll++;
  
        } catch (error) {
          console.error('An error occurred while fetching new gear', error);
          break;
        }
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
