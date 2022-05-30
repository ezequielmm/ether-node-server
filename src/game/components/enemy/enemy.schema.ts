import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnemyCategoryEnum, EnemyTypeEnum, EnemySizeEnum } from './enums';
import { Factory } from 'nestjs-seeder';
import { Faker } from '@faker-js/faker';
import { getRandomBetween, getRandomEnumValue } from '../../../utils';

export type EnemyDocument = Enemy & Document;

@Schema()
export class Enemy {
    // @Factory(() => faker.name.findName())
    @Prop()
    name: string;

    // @Factory(() => getRandomEnumValue(EnemyTypeEnum))
    @Prop()
    type: EnemyTypeEnum;

    // @Factory(() => getRandomEnumValue(EnemyCategoryEnum))
    @Prop()
    category: EnemyCategoryEnum;

    // @Factory(() => getRandomBetween(20, 100))
    @Prop()
    hitPoints: number;

    // @Factory(() => getRandomBetween(20, 100))
    @Prop()
    minAttack: number;

    // @Factory(() => getRandomBetween(20, 100))
    @Prop()
    maxAttack: number;

    // @Factory((faker: Faker) => faker.random.words(5))
    @Prop()
    description: string;

    // @Factory(() => getRandomEnumValue(EnemySizeEnum))
    @Prop()
    size: EnemySizeEnum;
}

export const EnemySchema = SchemaFactory.createForClass(Enemy);
