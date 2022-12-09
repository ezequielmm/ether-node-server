import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
    imports: [
        ApiModule,
        ConfigModule.forRoot({ isGlobal: true, cache: true }),
        SocketModule,
        TypegooseModule.forRootAsync({
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
