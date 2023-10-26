import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Gear } from './gear.schema';
import { GearRarityEnum } from './gear.enum';
import { getDecimalRandomBetween } from '../../../utils';
import { ILootboxRarityOdds } from './gear.interface';
import { data as GearData } from './gear.data';
import { find, sample } from 'lodash';
import { FilterQuery } from 'mongoose';
import { PlayerGear } from 'src/playerGear/playerGear.schema';

@Injectable()
export class GearService {
  constructor(
    @InjectModel(Gear)
    private readonly gearModel: ReturnModelType<typeof Gear>,
  ) { }

  private gearData = GearData;

  private halloweenGearsFilter = {
    gearId: {
        $gte: 500,
        $lte: 520
    },
  };

  private selectRandomRarity(rarities: ILootboxRarityOdds) {
    let rolls = new Map<string, number>();
    let dropRates = [
      {
        type: GearRarityEnum.Common,
        rate: rarities.common * 10,
      },
      {
        type: GearRarityEnum.Uncommon,
        rate: rarities.uncommon * 10,
      },
      {
        type: GearRarityEnum.Rare,
        rate: rarities.rare * 10,
      },
      {
        type: GearRarityEnum.Epic,
        rate: rarities.epic * 10,
      },
      {
        type: GearRarityEnum.Legendary,
        rate: rarities.legendary * 10,
      },
    ];

    let max = dropRates.reduce((acc, curr) => acc + curr.rate, 0);
    let roll = Math.floor(Math.random() * max);

    let current = 0;
    let rarity = GearRarityEnum.Common;
    for (const dropRate of dropRates) {
      current += dropRate.rate;

      if (roll < current) {
        let currentRolls = rolls.get(dropRate.type);

        if (!currentRolls) currentRolls = 0;

        rolls.set(dropRate.type, currentRolls + 1);
        rarity = dropRate.type;
        break;
      }
    }
    return rarity;
  }

  async getLootbox(size: number, rarities?: ILootboxRarityOdds): Promise<Gear[]> {
    const gear_list: Gear[] = [];

    for (let i = 0; i < size; i++) {
      const one_gear = await this.getOneGear(
        this.selectRandomRarity(rarities),
      );
      gear_list.push(one_gear);
    }

    return gear_list;
  }

  async getHalloweenLootbox(size: number, rarities?: ILootboxRarityOdds): Promise<Gear[]> {
    const gear_list: Gear[] = [];

    for (let i = 0; i < size; i++) {
      const one_gear = await this.getOneHalloweenGear(
        this.selectRandomRarity(rarities),
      );
      gear_list.push(one_gear);
    }

    return gear_list;
  }

  async getUniqueHalloweenLoot(
    size: number,
    rarities?: ILootboxRarityOdds,
    userGear: Gear[] = [],
    filter: FilterQuery<PlayerGear> = {}
  ): Promise<Gear[]> {
    //console.log('Starting to generate lootbox...');
    const gear_list: Gear[] = [];
    const uniqueGearIds: Set<string> = new Set();

    userGear.forEach((gear) => uniqueGearIds.add(gear.gearId.toString()));

    //let targetGearSet = '';
    let allGear: Gear[] = await this.getAllGear(filter);

    //allGear = allGear.filter((gear) => gear.name === targetGearSet);

    let itemAdded = false;

    //- Gets one random rarity:
    let targetRarity = this.selectRandomRarity(rarities);

    while (itemAdded === false) {

      //- Gets one Halloween gear with the rarity:
      const newGear = this.getRandomGearByRarity(allGear, targetRarity);

      console.log("New gear try:")
      console.log(newGear)

      if (uniqueGearIds.has(newGear.gearId.toString())) {

        targetRarity = this.downgradeRarity(targetRarity);

        if (targetRarity === null) {
          //console.log('Target rarity null, break');
          break;
        }
      } 
      else {
        console.log(`Adding: ${newGear.gearId} - ${newGear.rarity}`);
        gear_list.push(newGear);
        uniqueGearIds.add(newGear.gearId.toString());
        itemAdded = true;
      }

    }

    return gear_list;
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

  private getRandomGearByRarity(
    allGear: Gear[],
    targetRarity: GearRarityEnum,
  ): Gear | null {
    // Filter the allGear array by the target rarity
    const filteredGear = allGear.filter((gear) => gear.rarity === targetRarity);

    // Use lodash's sample method to get a random gear item

    console.log("GetRandomGearByRarity filteredGear:")
    console.log(filteredGear)
    console.log("-------------------------------------")
    return sample(filteredGear) || null;
  }
  async getOneGear(rarity: GearRarityEnum): Promise<Gear> {
    const availableGear = await this.gearModel.find({ rarity });
    return sample(availableGear);
  }

  async getOneHalloweenGear(rarity: GearRarityEnum): Promise<Gear> {
    const query = { rarity, ...this.halloweenGearsFilter };
    const availableGear = await this.gearModel.find(query);

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

  async getAllGear(filter: FilterQuery<PlayerGear> = {}): Promise<Gear[] | null> {
    try {
      const allGear = await this.gearModel.find(filter);
      return allGear;
    } catch (error) {
      console.error('An error occurred while fetching all gear:', error);
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