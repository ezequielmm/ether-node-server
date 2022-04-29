import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Character, CharacterSchema } from './character.schema';
import { CharacterService } from './character.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Character.name,
                schema: CharacterSchema,
            },
        ]),
    ],
    providers: [CharacterService],
    exports: [CharacterService],
})
export class CharacterModule {}
