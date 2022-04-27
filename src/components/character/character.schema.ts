import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { Faker } from '@faker-js/faker';
import { CharacterClassEnum } from './enums';

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
    initial_health: number;

    @Factory(120)
    @Prop()
    initial_gold: number;

    @Factory(CharacterClassEnum.Knight)
    @Prop()
    character_class: CharacterClassEnum;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
