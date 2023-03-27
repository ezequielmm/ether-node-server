import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { PlayerGear } from './playerGear.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { Gear } from '../game/components/gear/gear.schema';
import { GearItem } from './gearItem';
import { compact } from 'lodash';

@Injectable()
export class PlayerGearService {
    private readonly defaultGear: number[] = [
        0, 1, 2, 24, 41, 71, 91, 112, 131, 151, 169, 182,
    ];

    constructor(
        @InjectModel(PlayerGear)
        private readonly playerGear: ReturnModelType<typeof PlayerGear>,
    ) {}

    async findUnownedEquippedGear(
        playerId: number,
        equipped: GearItem[],
    ): Promise<GearItem[]> {
        const owned = await this.getGear(playerId);

        return equipped.filter((gear) => {
            //is doing !owned.includes(gear);
            !owned.find((owned_gear) => {
                return owned_gear.gearId === gear.gearId;
            });
        });
    }

    async allAreOwned(
        playerId: number,
        equipped_gear_list: GearItem[],
    ): Promise<boolean> {
        const unownedGear = await this.findUnownedEquippedGear(
            playerId,
            equipped_gear_list,
        );
        return unownedGear.length === 0;
    }

    async getGear(playerId: number): Promise<GearItem[]> {
        try {
            let player: PlayerGear = await this.playerGear.findOneAndUpdate(
                {
                    playerId: playerId,
                },
                {},
                { new: true, upsert: true },
            );

            if (!player.gear.length) {
                player = await this.addGearToPlayerById(
                    playerId,
                    this.defaultGear,
                );
            }

            return player.gear;
        } catch (e) {
            return;
        }
    }

    async addGearToPlayer(playerId: number, gear: Gear[]): Promise<PlayerGear> {
        const gearItems = gear.map(function (item) {
            return this.toGearItem(item);
        });

        try {
            return await this.playerGear.findOneAndUpdate(
                { playerId: playerId },
                { $push: { gear: { $each: gearItems } } },
                { new: true, upsert: true },
            );
        } catch (e) {
            // TODO: Handle error saving
        }
        
    }

    async addGearToPlayerById(
        playerId: number,
        gear: number[],
    ): Promise<PlayerGear> {
        const gears: Gear[] = compact(
            gear.map(function (item) {
                return this.gearService.getGearById(item);
            }),
        ); // TODO: ensure this does something non-silent if a gear ID doesn't match gear
        return await this.addGearToPlayer(playerId, gears);
    }

    async removeGearFromPlayerById(
        playerId: number,
        gear: number[],
    ): Promise<PlayerGear> {
        const playerGear = await this.getGear(playerId);

        gear.forEach((item) => {
            const index = playerGear.findIndex((i) => i.gearId === item);
            playerGear.splice(index, 1);
        });

        return await this.playerGear.findOneAndUpdate(
            { playerId: playerId },
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
}
