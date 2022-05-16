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
    enemy_type: EnemyTypeEnum;

    @Factory(() => {
        return getRandomEnumValue(EnemyCategoryEnum);
    })
    @Prop()
    enemy_category: EnemyCategoryEnum;

    @Factory(() => {
        return getRandomBetween(20, 100);
    })
    @Prop()
    life: number;

    @Factory(() => {
        return getRandomBetween(20, 100);
    })
    @Prop()
    min_attack: number;

    @Factory(() => {
        return getRandomBetween(20, 100);
    })
    @Prop()
    max_attack: number;
}

export const EnemySchema = SchemaFactory.createForClass(Enemy);
