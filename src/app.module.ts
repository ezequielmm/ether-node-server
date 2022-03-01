import { Module } from '@nestjs/common';
import { CharacterClassModule } from './character-class/character-class.module';
import { PrismaModule } from './prisma.module';

@Module({
    imports: [CharacterClassModule, PrismaModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
