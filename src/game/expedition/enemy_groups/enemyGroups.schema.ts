import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnemyGroupTypeEnum } from '../enums';

export type EnemyGroupDocument = EnemyGroup & Document;

@Schema()
export class EnemyGroup {
    @Prop()
    act: number;

    @Prop()
    groupNumber: number;

    @Prop()
    chance: number;

    @Prop()
    type: EnemyGroupTypeEnum;

    @Prop()
    enemies: string[];

    @Prop()
    stepMin: number;

    @Prop()
    stepMax: number;
}

export const EnemyGroupSchema = SchemaFactory.createForClass(EnemyGroup);
