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
    map_id: string;

    @Prop()
    event_id: string;

    @Prop()
    available_at: Date;

    @Prop()
    ends_at?: Date;

    @Prop()
    valid_until?: Date;

    updateEndTimes(): void {
        const contest_duration = 24 * 60 * 60 * 1000; // 24 hours in microseconds
        // const valid_extension = 6 * 60 * 60 * 1000; // 6 hours in microseconds
        const ends_at = new Date();
        const valid_until = new Date();

        ends_at.setTime(this.available_at.getTime() + contest_duration);

        valid_until.setTime(ends_at.getTime() + contest_duration);

        this.ends_at = ends_at;
        this.valid_until = valid_until;
    }
}
