import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { JsonEffect } from 'src/game/effects/effects.interface';
import { CardStatus } from 'src/game/status/interfaces';
import { CardRarityEnum, CardTypeEnum, CardKeywordEnum } from './card.enum';

export type CardDocument = Card & Document;

@Schema()
export class Card {
    @Prop({ unique: true })
    cardId: number;

    @Prop()
    name: string;

    @Prop()
    rarity: CardRarityEnum;

    @Prop()
    cardType: CardTypeEnum;

    @Prop()
    pool: string;

    @Prop()
    energy: number;

    @Prop()
    description: string;

    @Prop({ type: Object })
    properties: {
        effects: JsonEffect[];
        statuses: CardStatus[];
    };

    @Prop()
    keywords: CardKeywordEnum[];

    @Prop({ type: Object })
    merchantInfo?: {
        coinCost: number[];
    };

    @Prop({ default: false })
    showPointer: boolean;

    @Prop({ default: false })
    isUpgraded: boolean;
}

export const CardSchema = SchemaFactory.createForClass(Card);
