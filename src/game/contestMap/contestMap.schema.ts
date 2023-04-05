import { ModelOptions, Prop, PropType } from '@typegoose/typegoose';
import { HydratedDocument } from 'mongoose';
import { Node } from '../components/expedition/node';

@ModelOptions({
    schemaOptions: {
        collection: 'contestMaps',
        versionKey: false,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
})
export class ContestMap {
    @Prop()
    name: string;

    @Prop({ type: () => [Node] }, PropType.ARRAY)
    nodes: Node[];

    @Prop()
    maxSteps: number;

    @Prop()
    maxNodes: number;
}

export type ContestMapDocument = HydratedDocument<ContestMap>;
