import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { Faker } from '@faker-js/faker';
import { getRandomBetween, getRandomEnumValue } from '../../utils';
import { TrinketRarityEnum } from './enums';

export type TrinketDocument = Trinket & Document;

@Schema()
export class Trinket {
    @Factory((faker: Faker) => faker.name.findName())
    @Prop()
    readonly name: string;

    @Factory(() => {
        return getRandomEnumValue(TrinketRarityEnum);
    })
    @Prop()
    readonly rarity: string;

    @Factory(() => {
        return getRandomBetween(50, 100);
    })
    @Prop()
    readonly coin_cost: number;

    @Factory('move')
    @Prop()
    readonly effect: string;

    @Factory('attack')
    readonly trigger: string;
}

export const TrinketSchema = SchemaFactory.createForClass(Trinket);
