import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({
    collection: 'settings',
    versionKey: false,
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

    @Prop()
    initialPotionChance: number;

    @Prop()
    maxCardRewardsInCombat: number;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
