import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EncounterDocument = Encounter & Document;
@Schema({
    collection: 'encounter',
    versionKey: false,
})
export class Encounter {
    @Prop()
    encounterId: number;

    @Prop({ type: Object })
    stages: {
        buttonText: string[];
        displayText: string;
        effects: any[];
    }[];
}
export const EncounterSchema = SchemaFactory.createForClass(Encounter);
