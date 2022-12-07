import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class ExpeditionActConfig {
    @Prop()
    potionChance: number;
}

export const ExpeditionActConfigSchema =
    SchemaFactory.createForClass(ExpeditionActConfig);
