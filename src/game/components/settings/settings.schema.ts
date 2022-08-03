import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SettingsDocument = Settings & Document;

@Schema({
    collection: 'settings',
})
export class Settings {
    @Prop()
    initialEnergy: number;

    @Prop()
    maxEnergy: number;

    @Prop()
    initialHandPileSize: number;

    @Prop()
    initialDeckSize: number;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
