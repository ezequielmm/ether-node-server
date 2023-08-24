import { ModelOptions, Prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: {
        collection: 'contests',
        versionKey: false,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
})
export class Contest {
    @Prop()
    stages: string[];

    @Prop()
    event_id: number;

    @Prop()
    available_at: Date;

    @Prop()
    ends_at: Date;

    @Prop()
    valid_until: Date;

    @Prop()
    name: string;
}
