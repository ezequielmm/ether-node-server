import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { ConfigurationModule } from './config/configuration.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigurationService } from './config/configuration.service';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    imports: [
        ApiModule,
        ConfigurationModule,
        SocketModule,
        MongooseModule.forRootAsync({
            imports: [ConfigurationModule],
            inject: [ConfigurationService],
            useFactory: (configurationService: ConfigurationService) => {
                const options: MongooseModuleOptions = {
                    uri: configurationService.connectionString,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                };
                return options;
            },
        }),
        EventEmitterModule.forRoot({
            wildcard: true,
        }),
    ],
    controllers: [AppController],
})
export class AppModule {}
