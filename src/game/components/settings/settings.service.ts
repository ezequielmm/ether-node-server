import { Injectable, Logger } from '@nestjs/common';
import { Settings, SettingsDocument } from './settings.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class SettingsService {
    private readonly logger = new Logger(SettingsService.name);

    constructor(
        @InjectModel(Settings.name)
        private readonly settings: Model<SettingsDocument>,
        private readonly eventEmitter: EventEmitter2,
    ) {
        this.eventEmitter.prependAny((eventName) => {
            this.logger.log(`${eventName} Event emitted`);
        });
    }

    async getSettings(): Promise<Settings> {
        const settings = await this.settings.findOne().lean();
        if (!settings) {
            this.logger.error('No settings found');
            throw new Error('No settings found');
        }
        return settings;
    }
}
