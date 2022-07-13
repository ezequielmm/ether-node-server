import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Seeder } from 'nestjs-seeder';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './settings.schema';
import { settingsData } from './settings.data';

@Injectable()
export class SettingsSeeder implements Seeder {
    constructor(
        @InjectModel(Settings.name)
        private readonly settings: Model<SettingsDocument>,
    ) {}

    async seed(): Promise<any> {
        return this.settings.insertMany(settingsData);
    }

    async drop(): Promise<any> {
        return this.settings.deleteMany({});
    }
}
