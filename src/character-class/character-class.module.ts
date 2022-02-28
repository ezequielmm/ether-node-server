import { Module } from '@nestjs/common';
import { CharacterClassService } from './character-class.service';
import { CharacterClassController } from './character-class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterClass } from './entities/character-class.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CharacterClass])],
    controllers: [CharacterClassController],
    providers: [CharacterClassService],
})
export class CharacterClassModule {}
