import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnemyCategoryEnum, EnemyTypeEnum } from './enums';
import { Factory } from 'nestjs-seeder';
import { Faker } from '@faker-js/faker';
import { getRandomBetween, getRandomEnumValue } from '../../../utils';

export type EnemyDocument = Enemy & Document;

@Schema()
export class Enemy {
    @Factory((faker: Faker) => faker.name.findName())
    @Prop()
    name: string;

    @Factory(() => {
        return getRandomEnumValue(EnemyTypeEnum);
    })
    @Prop()
    type: EnemyTypeEnum;

    @Factory(() => {
        return getRandomEnumValue(EnemyCategoryEnum);
    })
    @Prop()
    category: EnemyCategoryEnum;

    @Factory(() => {
        return getRandomBetween(20, 100);
    })
    @Prop()
    hitPoints: number;

    @Factory(() => {
        return getRandomBetween(20, 100);
    })
    @Prop()
    minAttack: number;

    @Factory(() => {
        return getRandomBetween(20, 100);
    })
    @Prop()
    maxAttack: number;

    @Factory(() => {
        return getRandomBetween(20, 100);
    })
    @Prop()
    description: string;
}

export const EnemySchema = SchemaFactory.createForClass(Enemy);
