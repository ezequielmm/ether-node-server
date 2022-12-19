import { Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { Settings } from './settings.schema';
import { SettingsService } from './settings.service';

@Module({
    imports: [KindagooseModule.forFeature([Settings])],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule {}
