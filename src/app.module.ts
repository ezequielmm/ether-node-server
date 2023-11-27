import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KindagooseModule } from 'kindagoose';
import { BugReportModule } from './bugReport/bugReport.module';
import { WalletModule } from './wallet/wallet.module';
import { LoggerModule } from 'nestjs-pino';
import { createWriteStream } from 'pino-papertrail';
import { PlayerGearModule } from './playerGear/playerGear.module';
import { serverEnvironments } from './utils';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './tasks/task.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AuthModule } from './auth/auth.module';
import { ResetModule } from './tasks/reset.module';
import { CleanModule } from './tasks/clean.module';
import { ResetWinModule } from './tasks/resetwins.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        //TaskModule,
        ResetWinModule,
        LoggerModule.forRoot({
            pinoHttp: {
                level: 'warn',
                transport:{
                    target: "pino-pretty",
                    options: {
                        messageKey: "message",
                        colorize: true
                    }
                },
                messageKey: "message"
            }
        }),
        BugReportModule,
        PlayerGearModule,
        WalletModule,
        LeaderboardModule,
        ApiModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true, cache: true }),
        SocketModule,
        KindagooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const uri = configService.get<string>('MONGODB_URL');

                return {
                    uri,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                };
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
