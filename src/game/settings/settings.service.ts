import { Logger } from '@nestjs/common';
import { Settings, SettingsDocument } from './settings.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class SettingsService {
    private readonly logger = new Logger(SettingsService.name);
    constructor(
        @InjectModel(Settings.name)
        private readonly settings: Model<SettingsDocument>,
    ) {}

    async getSettings(): Promise<Settings> {
        const settings = await this.settings.findOne();
        if (!settings) {
            this.logger.error('No settings found');
            throw new Error('No settings found');
        }
        return settings;
    }

    async updateSettings(settings: Settings): Promise<void> {
        await this.settings.updateOne({}, { $set: settings });
    }
}
