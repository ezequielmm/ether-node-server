import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Gear } from './gear.schema';
import { GearRarityEnum } from './gear.enum';
import { getRandomBetween } from "../../../utils";

@Injectable()
export class GearService {
    constructor(
        @InjectModel(Gear)
        private readonly gearModel: ReturnModelType<typeof Gear>,
    ) {}

    async getOneGear(rarity): Promise<Gear> {
        const all = await this.gearModel.find({ rarity: rarity });
        const which_one = getRandomBetween(0, all.length);
        return all[which_one];
    }
}
