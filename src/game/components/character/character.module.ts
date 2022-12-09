import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Character } from './character.schema';
import { CharacterService } from './character.service';

@Module({
    imports: [
        TypegooseModule.forFeature([
            Character,
        ]),
    ],
    providers: [CharacterService],
    exports: [CharacterService],
})
export class CharacterModule { }
