import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
    originPile: string;

    @Prop()
    amount: number;
}

export const CardSelectionScreenSchema =
    SchemaFactory.createForClass(CardSelectionScreen);
