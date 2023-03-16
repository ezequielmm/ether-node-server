import { ModelOptions, Prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

@ModelOptions({
    schemaOptions: { collection: 'contestMaps', versionKey: false },
})
export class ContestMap {
    //_id: Schema.Types.ObjectId;
    
    @Prop()
    name: string;
}
