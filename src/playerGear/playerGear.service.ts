import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { PlayerGear } from './playerGear.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { data } from '../game/components/gear/gear.data';
import { Gear } from '../game/components/gear/gear.schema';
import { GearItem } from './gearItem';
import {
    GearCategoryEnum,
    GearRarityEnum,
    GearTraitEnum,
} from '../game/components/gear/gear.enum';
import { ExpeditionService } from '../game/components/expedition/expedition.service';
import { ExpeditionStatusEnum } from '../game/components/expedition/expedition.enum';
import { filter, isEqual } from 'lodash';

@Injectable()
export class PlayerGearService {
    private readonly logger: Logger = new Logger(PlayerGearService.name);

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
        const errorMessage = await this.dev_addLootForDevelopmentTesting(
            playerId,
        );

        const { gear: ownedGear } = await this.playerGear.findOne({
            playerId: playerId,
        });

        return ownedGear;
    }

    async addGearToPlayerById(
        playerId: number,
        gear: number[],
    ): Promise<void> {
        const gearItems = gear.map(function(item) {
                          return this.toGearItem(data[item]);
                        });
        this.playerGear.updateOne({playerId: playerId}, { $push: { gear: { $each: gearItems } } });
    }

    async removeGearFromPlayerById(
        playerId: number,
        gear: number[],
    ): Promise<void> {
        const playerGear = await this.getGear(playerId);

        gear.forEach(function(item) {
            const index = playerGear.findIndex(i => i.gearId === item);
            playerGear.splice(index, 1);
        });

        this.playerGear.updateOne({ playerId: playerId }, { gear: playerGear });
    }

    async dev_addLootForDevelopmentTesting(playerId: number) {
        try {
            const gearList = await this.playerGear.findOne({
                playerId: playerId,
            });
            if (gearList) return;
        } catch (e) {
            return;
        }
        const p: PlayerGear = {
            playerId: playerId,
            gear: [
                this.toGearItem(data[0]),
                this.toGearItem(data[1]),
                this.toGearItem(data[2]),
                this.toGearItem(data[24]),
                this.toGearItem(data[41]),
                this.toGearItem(data[71]),
                this.toGearItem(data[91]),
                this.toGearItem(data[112]),
                this.toGearItem(data[131]),
                this.toGearItem(data[151]),
                this.toGearItem(data[169]),
                this.toGearItem(data[182]),
            ],
        };
        try {
            await this.playerGear.create(p);
        } catch (e) {
            return 'create failed';
        }
        return null;
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
