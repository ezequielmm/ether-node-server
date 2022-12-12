import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReturnModelType } from '@typegoose/typegoose';
import { Model } from 'mongoose';
import { InjectModel } from 'kindagoose';
import { Settings } from './settings.schema';

@Injectable()
export class SettingsService {
    private readonly logger = new Logger(SettingsService.name);

    constructor(
        @InjectModel(Settings)
        private readonly settings: ReturnModelType<typeof Settings>,
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
