import { modelOptions, Prop, PropType, Ref, Severity } from '@typegoose/typegoose';
import mongoose, { HydratedDocument, ObjectId, Schema, Types } from 'mongoose';
import { Node } from './node';

export type MapDocument = HydratedDocument<OldMapType>;


@modelOptions({
    schemaOptions: { collection: 'oldmaps', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class OldMapType {

    @Prop()
    clientId?: string;
    
    @Prop()
    _id: Types.ObjectId; // Asegúrate de que esta propiedad tiene el tipo ObjectId
    // Otras propiedades de MapType

    @Prop({ type: () => [Node] }, PropType.ARRAY)
    map: Node[]; // O el tipo correcto para los nodos de tu mapa, reemplaza Node[] con el tipo correcto

}

// export { MapType };

const MapTypeSchema: Schema = new Schema({
    // Campos y tipos de datos de tu esquema MapType
});


export const OldMapTypeModel = mongoose.model<OldMapType>('OldMapType', MapTypeSchema);