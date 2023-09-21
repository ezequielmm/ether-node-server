import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Gear } from './gear.schema';
import { GearRarityEnum, GearTraitEnum } from './gear.enum';
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
        userGear: Gear[] = [],
      ): Promise<Gear[]> {
        //console.log('Starting to generate lootbox...');
        const gear_list: Gear[] = [];
        const uniqueGearIds: Set<string> = new Set();
    
        userGear.forEach((gear) => uniqueGearIds.add(gear.gearId.toString()));
    
       /* console.log(
          `Initial unique gear IDs: ${Array.from(uniqueGearIds).join(', ')}`,
        );
    */

        // Gear que va a salir en la lootbox
        let targetGearSet = '';
        let allGear: Gear[] = await this.getAllGear();
        allGear = allGear.filter((gear) => gear.name === targetGearSet);
    
        let itemAdded = false;
        let targetRarity = this.selectRandomRarity(rarities);
    
        while (itemAdded === false) {
          const newGear = this.getRandomGearByRarity(allGear, targetRarity);
    
          if (uniqueGearIds.has(newGear.gearId.toString())) {
           /* console.log(
              `Repeated: ${newGear.gearId.toString()} - ${newGear.rarity}`,
            );*/
            targetRarity = this.downgradeRarity(targetRarity);
    
            if (targetRarity === null) {
              //console.log('Target rarity null, break');
              break;
            }
          } else {
            console.log(`Adding: ${newGear.gearId} - ${newGear.rarity}`);
            gear_list.push(newGear);
            uniqueGearIds.add(newGear.gearId.toString());
            itemAdded = true;
          }
    
        return gear_list;
      }
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

    async getAllGear(): Promise<Gear[] | null> {
        try {
          const allGear = await this.gearModel.find({});
          return allGear;
        } catch (error) {
          console.error('An error occurred while fetching all gear:', error);
          return null;
        }
      }

      private getRandomGearByRarity(
        allGear: Gear[],
        targetRarity: GearRarityEnum,
      ): Gear | null {
        // Filter the allGear array by the target rarity
        const filteredGear = allGear.filter((gear) => gear.rarity === targetRarity);
    
        // Use lodash's sample method to get a random gear item
        return sample(filteredGear) || null;
      }

      private downgradeRarity(
        currentRarity: GearRarityEnum,
      ): GearRarityEnum | null {
        //console.log(`Current rarity: ${currentRarity}. Attempting to downgrade...`); // Added log
    
        switch (currentRarity) {
          case GearRarityEnum.Legendary:
            //console.log(`Downgraded from Legendary to Epic`); // Added log
            return GearRarityEnum.Epic;
          case GearRarityEnum.Epic:
            //console.log(`Downgraded from Epic to Rare`); // Added log
            return GearRarityEnum.Rare;
          case GearRarityEnum.Rare:
            //console.log(`Downgraded from Rare to Uncommon`); // Added log
            return GearRarityEnum.Uncommon;
          case GearRarityEnum.Uncommon:
            //console.log(`Downgraded from Uncommon to Common`); // Added log
            return GearRarityEnum.Common;
          default:
            //console.log('No lower rarity available'); // Added log
            return null;
        }
      }
}
