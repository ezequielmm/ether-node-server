import { Module } from '@nestjs/common';
import { CardModule } from './card/card.module';
import { CharacterClassModule } from './character-class/character-class.module';
import { CharacterModule } from './character/character.module';
import { EnemyModule } from './enemy/enemy.module';
import { PrismaModule } from './prisma.module';
import { ProfileModule } from './profile/profile.module';
import { RoomModule } from './room/room.module';
import { LoginModule } from './login/login.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards';

@Module({
    imports: [
        PrismaModule,
        CharacterClassModule,
        CharacterModule,
        ProfileModule,
        CardModule,
        EnemyModule,
        RoomModule,
        LoginModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AccessTokenGuard,
        },
    ],
})
export class AppModule {}
