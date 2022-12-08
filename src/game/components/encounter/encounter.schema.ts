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
        // eslint-disable-next-line @typescript-eslint/ban-types
        buttons: {
            text: string;
            nextStage: number;
            effects: any[];
        }[];
        displayText: string;
    }[];
}
export const EncounterSchema = SchemaFactory.createForClass(Encounter);
