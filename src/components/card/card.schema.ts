import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CardClassEnum, CardRarityEnum, CardTypeEnum } from './enums';
import { Document } from 'mongoose';

export type CardDocument = Card & Document;

@Schema()
export class Card {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    code: string;

    @Prop()
    rarity: CardRarityEnum;

    @Prop()
    energy: number;

    @Prop()
    card_type: CardTypeEnum;

    @Prop()
    coin_min: number;

    @Prop()
    coin_max: number;

    @Prop()
    active: boolean;

    @Prop()
    card_class: CardClassEnum;
}

export const CardSchema = SchemaFactory.createForClass(Card);
