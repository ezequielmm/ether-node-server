import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { ConfigurationModule } from './config/configuration.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigurationService } from './config/configuration.service';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';

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
        LoggerModule.forRoot({
            pinoHttp: {
                transport:
                    process.env.NODE_ENV !== 'production'
                        ? { target: 'pino-pretty' }
                        : undefined,
            },
        }),
    ],
    controllers: [AppController],
})
export class AppModule {}
