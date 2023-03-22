import { ModelOptions, Prop, PropType } from '@typegoose/typegoose';
import { HydratedDocument } from 'mongoose';
import { Node } from '../components/expedition/node';

@ModelOptions({
    schemaOptions: { collection: 'contestMaps', versionKey: false },
})
export class ContestMap {
    @Prop()
    name: string;

    @Prop({ type: () => [Node] }, PropType.ARRAY)
    node: Node[];
}

export type ContestMapDocument = HydratedDocument<ContestMap>;
