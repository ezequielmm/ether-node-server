import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Factory } from 'nestjs-seeder';

export type SettingsDocument = Settings & Document;

@Schema()
export class Settings {
    @Prop({ type: Object })
    @Factory({
        energy: {
            initial: 3,
            max: 3,
        },
        handSize: 5,
    })
    player: {
        energy: {
            initial: number;
            max: number;
        };
        handSize: number;
    };
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
