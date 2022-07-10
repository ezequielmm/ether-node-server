import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeckSettings } from './seetings.interface';

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
        deckSettings: DeckSettings;
    };
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
