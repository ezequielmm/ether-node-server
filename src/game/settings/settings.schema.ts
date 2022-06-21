import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Factory } from 'nestjs-seeder';

export type SettingsDocument = Settings & Document;

@Schema()
export class Settings {
    @Prop({ type: Object })
    @Factory({
        player: {
            energy: {
                initial: 3,
                max: 3,
            },
        },
    })
    player: {
        energy: {
            initial: number;
            max: number;
        };
    };
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
