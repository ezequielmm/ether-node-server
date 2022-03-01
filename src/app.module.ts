import { Module } from '@nestjs/common';
import { CharacterClassModule } from './character-class/character-class.module';
import { CharacterModule } from './character/character.module';
import { PrismaModule } from './prisma.module';
import { ProfileModule } from './profile/profile.module';

@Module({
    imports: [
        PrismaModule,
        CharacterClassModule,
        CharacterModule,
        ProfileModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
