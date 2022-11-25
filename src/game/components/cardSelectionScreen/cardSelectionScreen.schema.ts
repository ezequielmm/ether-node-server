import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CardSelectionScreenOriginPileEnum } from './cardSelectionScreen.enum';

export type CardSelectionScreenDocument = HydratedDocument<CardSelectionScreen>;

@Schema({
    collection: 'cardSelectionScreens',
    versionKey: false,
})
export class CardSelectionScreen {
    @Prop()
    clientId: string;

    @Prop([String])
    cardIds: string[];

    @Prop({ type: String, enum: CardSelectionScreenOriginPileEnum })
    originPile: CardSelectionScreenOriginPileEnum;

    @Prop()
    amountToTake: number;
}

export const CardSelectionScreenSchema =
    SchemaFactory.createForClass(CardSelectionScreen);
