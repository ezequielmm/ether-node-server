import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SettingsDocument = Settings & Document;

@Schema()
export class Settings {
    @Prop({ type: Object })
    player: {
        energy: {
            initial: number;
            max: number;
        };
        handSize: number;
        deckSize: number;
    };
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
