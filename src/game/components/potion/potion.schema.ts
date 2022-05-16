import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { Faker } from '@faker-js/faker';

export type PotionDocument = Potion & Document;

@Schema()
export class Potion {
    @Factory((faker: Faker) => faker.name.findName())
    @Prop()
    name: string;
}

export const PotionSchema = SchemaFactory.createForClass(Potion);
