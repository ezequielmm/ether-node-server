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
    deck_id?: string;

    @Prop()
    maxSteps: number;

    @Prop()
    maxNodes: number;

    @Prop()
    actNumber?: number;

    @Prop()
    isGenerated: boolean;
}

export type ContestMapDocument = HydratedDocument<ContestMap>;
