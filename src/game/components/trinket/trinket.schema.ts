import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { JsonEffect } from 'src/game/effects/effects.interface';
import { GameContext } from '../interfaces';
import { TrinketRarityEnum } from './trinket.enum';

@Schema()
export class Trinket extends Document {
    constructor() {
        super();
        console.log('Trinket constructor');
    }

    @Prop()
    instanceId: number;

    @Prop()
    trinketId: number;

    @Prop({
        type: String,
        required: true,
    })
    name: string;

    @Prop()
    rarity: TrinketRarityEnum;

    @Prop()
    description: string;

    @Prop()
    effects: JsonEffect[];

    onAttach(_ctx: GameContext): void {
        throw new Error('Method not implemented.');
    }
}

export const TrinketSchema =
    SchemaFactory.createForClass(Trinket).loadClass(Trinket);
