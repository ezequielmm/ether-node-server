import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KindagooseModule } from 'kindagoose';
import { WalletModule } from './wallet/wallet.module';
import { LoggerModule } from 'nestjs-pino';
import { createWriteStream } from 'pino-papertrail';

@Module({
    imports: [
        LoggerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                pinoHttp: [
                    {
                        formatters: {
                            level(label, number) {
                                return { Lev: number };
                            },
                        },
                        messageKey: 'Msg',
                        transport:
                            process.env.NODE_ENV !== 'production'
                                ? { target: 'pino-pretty' }
                                : undefined,
                    },
                    createWriteStream({
                        appname: configService.get('PAPERTRAIL_APP_NAME'),
                        host: configService.get('PAPERTRAIL_HOSTNAME'),
                        port: configService.get('PAPERTRAIL_PORT'),
                    }),
                ],
            }),
        }),
        WalletModule,
        ApiModule,
        ConfigModule.forRoot({ isGlobal: true, cache: true }),
        SocketModule,
        KindagooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const uri = configService.get<string>('MONGODB_URL');

                return { uri, useNewUrlParser: true, useUnifiedTopology: true };
            },
        }),
        EventEmitterModule.forRoot({
            wildcard: true,
            maxListeners: 100,
        }),
    ],
    controllers: [AppController],
})
export class AppModule {}
