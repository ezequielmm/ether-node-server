import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { Faker } from '@faker-js/faker';
import { CharacterClassEnum } from './character.enum';

export type CharacterDocument = Character & Document;

@Schema()
export class Character {
    @Factory((faker: Faker) => faker.name.findName())
    @Prop()
    name: string;

    @Factory((faker: Faker) => faker.lorem.words(10))
    @Prop()
    description: string;

    @Factory(78)
    @Prop()
    initialHealth: number;

    @Factory(120)
    @Prop()
    initialGold: number;

    @Factory(CharacterClassEnum.Knight)
    @Prop()
    characterClass: CharacterClassEnum;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
