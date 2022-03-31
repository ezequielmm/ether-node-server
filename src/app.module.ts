import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { CardModule } from './card/card.module';
import { CardPoolModule } from './cardpool/cardpool.module';
import { CharacterClassModule } from './character-class/character-class.module';
import { CharacterModule } from './character/character.module';
import { DeckModule } from './deck/deck.module';
import { EnemyModule } from './enemy/enemy.module';
import { ExpeditionModule } from './expedition/expedition.module';
import { PrismaModule } from './prisma.module';
import { ProfileModule } from './profile/profile.module';
import { RoomModule } from './room/room.module';
import { LoginModule } from './login/login.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards';
import { TrinketModule } from './trinket/trinket.module';
import { SocketModule } from './socket/socket.module';

@Module({
    imports: [
        PrismaModule,
        MongooseModule.forRoot(process.env.MONGODB_URL),
        CharacterClassModule,
        CharacterModule,
        ProfileModule,
        CardModule,
        EnemyModule,
        RoomModule,
        ExpeditionModule,
        CardPoolModule,
        TrinketModule,
        DeckModule,
        SocketModule,
        LoginModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AccessTokenGuard,
        },
    ],
})
export class AppModule {}
