import { modelOptions, Prop, PropType, Ref, Severity } from '@typegoose/typegoose';
import mongoose, { HydratedDocument, ObjectId, Schema } from 'mongoose';
import { Node } from './node';


@modelOptions({
    schemaOptions: { collection: 'maps', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class MapType {
    @Prop()
    _id: ObjectId; // Asegúrate de que esta propiedad tiene el tipo ObjectId
    // Otras propiedades de MapType

    @Prop()
    map: Node[]; // O el tipo correcto para los nodos de tu mapa, reemplaza Node[] con el tipo correcto

}

// export { MapType };

const MapTypeSchema: Schema = new Schema({
    // Campos y tipos de datos de tu esquema MapType
});


export const MapTypeModel = mongoose.model<MapType>('MapType', MapTypeSchema);

