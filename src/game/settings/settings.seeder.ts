import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './settings.schema';

@Injectable()
export class SettingsSeeder implements Seeder {
    constructor(
        @InjectModel(Settings.name)
        private readonly settings: Model<SettingsDocument>,
    ) {}

    async seed(): Promise<any> {
        const settings = DataFactory.createForClass(Settings).generate(1);
        return this.settings.insertMany(settings);
    }

    async drop(): Promise<any> {
        return this.settings.deleteMany({});
    }
}
