import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PotionDocument = Potion & Document;

@Schema()
export class Potion {
    @Prop()
    name: string;
}

export const PotionSchema = SchemaFactory.createForClass(Potion);
