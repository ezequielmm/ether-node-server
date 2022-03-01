import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { CharacterClassController } from './character-class.controller';
import { CharacterClassService } from './character-class.service';

@Module({
    imports: [PrismaModule],
    controllers: [CharacterClassController],
    providers: [CharacterClassService],
})
export class CharacterClassModule {}
