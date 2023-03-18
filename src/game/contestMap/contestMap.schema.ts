import { ModelOptions, Prop, PropType } from '@typegoose/typegoose';
import { Node } from '../components/expedition/node';

@ModelOptions({
    schemaOptions: { collection: 'contestMaps', versionKey: false },
})
export class ContestMap {
    //_id: Schema.Types.ObjectId;

    @Prop()
    name: string;

    @Prop({ type: () => [Node] }, PropType.ARRAY)
    node: Node[];
}
