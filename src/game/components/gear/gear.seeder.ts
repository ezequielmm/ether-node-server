import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Gear } from './gear.schema';
import { data } from './gear.data';


@Injectable()
export class GearSeeder implements Seeder {
    constructor(
        @InjectModel(Gear) private readonly gear: ReturnModelType<typeof Gear>,
    ) {}

    async seed(): Promise<any> {
        return await this.gear.insertMany(data);
    }

    async drop(): Promise<any> {
        return await this.gear.deleteMany({});
    }
}
