import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { composeMongooseModuleOptions } from './dbConfiguration';

@Module({
    imports: [
        ApiModule,
        ConfigModule.forRoot({ isGlobal: true, cache: true }),
        SocketModule,
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const uri = configService.get<string>('MONGODB_URL');

                return composeMongooseModuleOptions(uri);
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
