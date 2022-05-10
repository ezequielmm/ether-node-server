import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CardClassEnum, CardRarityEnum, CardTypeEnum } from './enums';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { Faker } from '@faker-js/faker';
import { getRandomBetween, getRandomEnumValue } from 'src/utils';

export type CardDocument = Card & Document;

@Schema()
export class Card {
    @Factory((faker: Faker) => faker.name.findName())
    @Prop()
    readonly name: string;

    @Factory((faker: Faker) => faker.lorem.words(10))
    @Prop()
    readonly description: string;

    @Factory('knight_attack')
    @Prop()
    readonly code: string;

    @Factory(() => {
        return getRandomEnumValue(CardRarityEnum);
    })
    @Prop()
    readonly rarity: CardRarityEnum;

    @Factory(() => {
        return getRandomBetween(1, 3);
    })
    @Prop()
    readonly energy: number;

    @Factory(() => {
        return getRandomEnumValue(CardTypeEnum);
    })
    @Prop()
    readonly card_type: CardTypeEnum;

    @Factory(() => {
        return getRandomBetween(1, 200);
    })
    @Prop()
    readonly coin_min: number;

    @Factory(() => {
        return getRandomBetween(1, 200);
    })
    @Prop()
    readonly coin_max: number;

    @Factory(true)
    @Prop()
    readonly active: boolean;

    @Factory(CardClassEnum.Knight)
    @Prop()
    readonly card_class: CardClassEnum;
}

export const CardSchema = SchemaFactory.createForClass(Card);
