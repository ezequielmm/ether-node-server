import { Module } from '@nestjs/common';
import { CardModule } from './card/card.module';
import { CharacterClassModule } from './character-class/character-class.module';
import { CharacterModule } from './character/character.module';
import { EnemyModule } from './enemy/enemy.module';
import { PrismaModule } from './prisma.module';
import { ProfileModule } from './profile/profile.module';

@Module({
    imports: [
        PrismaModule,
        CharacterClassModule,
        CharacterModule,
        ProfileModule,
        CardModule,
        EnemyModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
