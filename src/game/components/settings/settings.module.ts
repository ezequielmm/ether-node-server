import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Settings } from './settings.schema';
import { SettingsService } from './settings.service';

@Module({
    imports: [
        TypegooseModule.forFeature([
            Settings
        ]),
    ],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule {}
