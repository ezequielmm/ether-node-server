import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { PlayerGear } from './playerGear.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { Gear } from '../game/components/gear/gear.schema';
import { GearItem } from './gearItem';
import { compact } from 'lodash';
import { FilterQuery } from 'mongoose';
import { Logger } from '@nestjs/common';
import { GearService } from 'src/game/components/gear/gear.service';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from 'src/game/components/gear/gear.enum';

@Injectable()
export class PlayerGearService {
    private readonly defaultGear: number[] = [
        1, 2, 24, 41, 71, 91, 112, 131, 151, 169, 182,
    ];
    private readonly logger: Logger = new Logger(PlayerGearService.name);

    constructor(
        @InjectModel(PlayerGear)
        private readonly playerGear: ReturnModelType<typeof PlayerGear>,
        private readonly gearService: GearService,
    ) {}

    async findUnownedEquippedGear(
        userAddress: string,
        equipped: GearItem[],
    ): Promise<GearItem[]> {
        const owned = await this.getGear(userAddress);

        return equipped.filter((gear) => {
            //is doing !owned.includes(gear);
            !owned.find((owned_gear) => {
                return owned_gear.gearId === gear.gearId;
            });
        });
    }

    async allAreOwned(userAddress: string, equipped_gear_list: GearItem[]): Promise<boolean> 
    {
        const unownedGear = await this.findUnownedEquippedGear(
            userAddress,
            equipped_gear_list,
        );
        return unownedGear.length === 0;
    }

    async allAreOwnedById(userAddress: string, equipped_gear_list: number[]): Promise<boolean> 
    {
        const unownedGear = await this.findUnownedEquippedGearById(
            userAddress,
            equipped_gear_list,
        );

        return unownedGear.length === 0;
    }

    async findUnownedEquippedGearById(userAddress: string, equipped: number[]): Promise<number[]> {
        const owned = await this.getGear(userAddress);

        return equipped.filter((gearId) => {
            return !owned.find((owned_gear) => {
                return owned_gear.gearId === gearId;
            });
        });
    }

    async getGear(userAddress: string, filter: FilterQuery<PlayerGear> = {}): Promise<any> 
    {
        let player: PlayerGear = await this.playerGear.findOne({
                userAddress,
                ...filter,
            })
            .lean();

        if (player === null) {
            this.logger.debug(`Player Gear Not Found for ${userAddress}. Creating...`);

            const startingGear = this.toGearItems(this.getGearByIds(this.defaultGear));

            player = await this.playerGear.create({
                userAddress,
                gear: startingGear,
            });
        }

        if (player === null) return [];

        return player.gear;
    }

    async addGearToPlayer(userAddress: string, gear: Gear[]): Promise<PlayerGear> 
    {

        console.log("addGearToPlayer", userAddress, gear);
        
        const gearItems = this.toGearItems(gear);

        for (let i = 0; i < gear.length; i++) {
            let gear: number = i;
          
            switch (gear[i]) {
              case 3301:
                var gearItem3301 = new GearItem();
                gearItem3301.gearId = 3301;
                gearItem3301.name = "Silver Prince";
                gearItem3301.category = GearCategoryEnum.Helmet;
                gearItem3301.rarity = GearRarityEnum.Epic;
                gearItem3301.trait = GearTraitEnum.Helmet; 
                

                gearItems.push(gearItem3301);

                break;
              case 3302:
                var gearItem3302 = new GearItem();
                gearItem3302.gearId = 3302;
                gearItem3302.name = "Gold Prince";
                gearItem3302.category = GearCategoryEnum.Helmet;
                gearItem3302.rarity = GearRarityEnum.Legendary;
                gearItem3302.trait = GearTraitEnum.Helmet; 
                

                gearItems.push(gearItem3302);

                break;
              case 3303:
                var gearItem3303 = new GearItem();
                gearItem3303.gearId = 3303;
                gearItem3303.name = "Blue Praying Hands";
                gearItem3303.category = GearCategoryEnum.Helmet;
                gearItem3303.rarity = GearRarityEnum.Epic;
                gearItem3303.trait = GearTraitEnum.Helmet; 
                

                gearItems.push(gearItem3303);

                break;
              case 3304:
                var gearItem3304 = new GearItem();
                gearItem3304.gearId = 3304;
                gearItem3304.name = "Red Hounskull";
                gearItem3304.category = GearCategoryEnum.Helmet;
                gearItem3304.rarity = GearRarityEnum.Rare;
                gearItem3304.trait = GearTraitEnum.Helmet; 
                

                gearItems.push(gearItem3304);

                break;
              case 3305:
                var gearItem3305 = new GearItem();
                gearItem3305.gearId = 3305;
                gearItem3305.name = "Red Hound";
                gearItem3305.category = GearCategoryEnum.Helmet;
                gearItem3305.rarity = GearRarityEnum.Rare;
                gearItem3305.trait = GearTraitEnum.Helmet; 
                

                gearItems.push(gearItem3305);

                break;
              default:
                console.log("Opción no válida");
            }
          }       
        
        
        try {
            return await this.playerGear.findOneAndUpdate(
                { userAddress },
                { $push: { gear: { $each: gearItems } } },
                { new: true, upsert: true },
            );
        } catch (e) {
            this.logger.error(e.stack);
        }
    }

    getGearByIds(gear: number[]): Gear[] {
        const gears: Gear[] = compact(
            gear.map((id) => this.gearService.getGearById(id)),
        );

        // TODO: ensure this does something non-silent if a gear ID doesn't match gear
        return gears;
    }

    async removeGearFromPlayer(userAddress: string, gear: Gear[]): Promise<PlayerGear> 
    {    
        const playerGear = await this.getGear(userAddress);

        gear.forEach((toRemove) => {
            const index = playerGear.findIndex(
                (i) => i.gearId === toRemove.gearId,
            );

            if(index >= 0)
                playerGear.splice(index, 1);
        });

        return await this.playerGear.findOneAndUpdate(
            { userAddress },
            { gear: playerGear },
            { new: true },
        );
    }

    toGearItems(gear: Gear[]): GearItem[] {
        const gearItems: GearItem[] = [];
      
        for (const gearItem of gear) {
          const gearItemMapped: GearItem = {
            gearId: gearItem.gearId,
            name: gearItem.name,
            trait: gearItem.trait,
            category: gearItem.category,
            rarity: gearItem.rarity,
          };
      
          gearItems.push(gearItemMapped);
        }
      
        return gearItems;
      }
}
