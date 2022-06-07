import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
    @Prop()
    _id: number;

    @Prop()
    name: string;

    @Prop()
    email: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
