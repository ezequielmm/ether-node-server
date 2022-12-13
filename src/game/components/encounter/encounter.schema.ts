import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EncounterDocument = Encounter & Document;
@Schema({
    collection: 'encounters',
    versionKey: false,
})
export class Encounter {
    @Prop()
    encounterId: number;

    @Prop()
    imageId: string;

    @Prop({ type: Object })
    stages: {
        // eslint-disable-next-line @typescript-eslint/ban-types
        displayText: string;
        buttons: {
            text: string;
            nextStage: number;
            effects: any[];
        }[];
    }[];
}
export const EncounterSchema = SchemaFactory.createForClass(Encounter);
