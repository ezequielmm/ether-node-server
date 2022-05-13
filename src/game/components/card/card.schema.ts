import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from './enums';
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

    @Factory(() => {
        return getRandomEnumValue(CardRarityEnum);
    })
    @Prop()
    readonly rarity: CardRarityEnum;

    @Factory(() => {
        return getRandomEnumValue(CardTypeEnum);
    })
    @Prop()
    readonly type: CardTypeEnum;

    @Factory('knight')
    @Prop()
    readonly pool: string;

    @Factory(() => {
        return getRandomBetween(1, 3);
    })
    @Prop()
    readonly energy: number;

    @Factory('Deal $prop.damage.current$ damage to target')
    @Prop()
    readonly description: string;

    @Factory(() => {
        return getRandomEnumValue(CardTargetedEnum);
    })
    @Prop()
    readonly targeted: CardTargetedEnum;

    readonly properties: {
        readonly damage: {
            readonly base: number;
        };
    };
}

export const CardSchema = SchemaFactory.createForClass(Card);
