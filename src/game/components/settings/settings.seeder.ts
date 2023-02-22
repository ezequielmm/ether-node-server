import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Seeder } from 'nestjs-seeder';
import { Settings } from './settings.schema';
import { settingsData } from './settings.data';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class SettingsSeeder implements Seeder {
    constructor(
        @InjectModel(Settings)
        private readonly settings: ReturnModelType<typeof Settings>,
    ) {}

    async seed(): Promise<any> {
        return this.settings.insertMany(settingsData);
    }

    async drop(): Promise<any> {
        return this.settings.deleteMany({});
    }
}
