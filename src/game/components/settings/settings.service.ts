import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'kindagoose';
import { FilterQuery } from 'mongoose';
import { Settings } from './settings.schema';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(Settings)
        private readonly settings: ReturnModelType<typeof Settings>,
    ) {}

    async getSettings(): Promise<Settings> {
        const settings = await this.settings.findOne().lean();
        if (!settings) throw new Error('No settings found');
        return settings;
    }

    async create(payload: Settings): Promise<Settings> {
        return await this.settings.create(payload);
    }

    async deleteMany(filter?: FilterQuery<Settings>): Promise<any> {
        return await this.settings.deleteMany(filter);
    }
}
