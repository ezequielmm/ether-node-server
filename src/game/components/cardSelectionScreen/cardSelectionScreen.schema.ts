import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CardSelectionScreenOriginPileEnum } from './cardSelectionScreen.enum';

export type CardSelectionScreenDocument = CardSelectionScreen & Document;

@Schema({
    collection: 'cardSelectionScreens',
})
export class CardSelectionScreen {
    @Prop()
    clientId: string;

    @Prop()
    cardIds: string[];

    @Prop()
    originPile: CardSelectionScreenOriginPileEnum;

    @Prop()
    amount: number;
}

export const CardSelectionScreenSchema =
    SchemaFactory.createForClass(CardSelectionScreen);
