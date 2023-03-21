import { ModelOptions, Prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

@ModelOptions({
    schemaOptions: { collection: 'contests', versionKey: false },
})
export class Contest {
    _id: Schema.Types.ObjectId;

    @Prop()
    map_id: string;

    @Prop()
    event_id: string;

    @Prop()
    available_at: Date;

    @Prop()
    valid_until?: Date;
}
