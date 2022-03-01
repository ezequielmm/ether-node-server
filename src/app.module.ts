import { Module } from '@nestjs/common';
import { CharacterClassModule } from './character-class/character-class.module';
import { CharacterModule } from './character/character.module';
import { PrismaModule } from './prisma.module';

@Module({
    imports: [CharacterClassModule, CharacterModule, PrismaModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
