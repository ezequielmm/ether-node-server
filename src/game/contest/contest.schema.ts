import { ModelOptions, Prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: { collection: 'contests', versionKey: false },
})
export class Contest {
    @Prop()
    map_id: string;

    @Prop()
    event_id: string;

    @Prop()
    available_at: Date;

    @Prop()
    valid_until?: Date;
}
