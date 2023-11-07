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

    async getHalloweenGear(userAddress: string): Promise<Gear[]> {
        let playerGears:PlayerGear = await this.playerGear.findOne({
            userAddress,
        })
        .lean();

        if (playerGears === null) {
            this.logger.debug(`Player Gear Not Found for ${userAddress}. Creating...`);

            const startingGear = this.toGearItems(this.getGearByIds(this.defaultGear));

            playerGears = await this.playerGear.create({
                userAddress,
                gear: startingGear,
            });
        }

        const gears:GearItem[] = playerGears.gear.filter(g => g.gearId >= 500 && g.gearId <= 520)
        return gears;
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

        const gearItems = this.toGearItems(gear);

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

    toGearItem(gear: Gear): GearItem {
        return {
            gearId: gear.gearId,
            name: gear.name,
            trait: gear.trait,
            category: gear.category,
            rarity: gear.rarity,
        };
    }

    toGearItems(gear: Gear[]): GearItem[] {
        return gear.map((g) => this.toGearItem(g));
    }
}
