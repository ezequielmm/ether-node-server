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

    @Prop()
    displayText: string;

    @Prop([String])
    buttonText: string[];
}
export const EncounterSchema = SchemaFactory.createForClass(Encounter);
