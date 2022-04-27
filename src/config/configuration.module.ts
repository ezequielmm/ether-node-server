import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    exports: [ConfigurationService],
    imports: [ConfigModule.forRoot()],
    providers: [ConfigurationService],
})
export class ConfigurationModule {}
