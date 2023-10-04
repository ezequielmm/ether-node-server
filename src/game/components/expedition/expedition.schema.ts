import { modelOptions, Prop, PropType, Ref, Severity } from '@typegoose/typegoose';
import mongoose, { HydratedDocument, ObjectId, Schema } from 'mongoose';
import { MerchantItems } from 'src/game/merchant/merchant.interface';
import { AttachedStatus, StatusType } from 'src/game/status/interfaces';
import { TreasureInterface } from 'src/game/treasure/treasure.interfaces';
import { CombatTurnEnum, ExpeditionStatusEnum } from './expedition.enum';
import { NodeType } from './node-type';
import {
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionPlayerStateDeckCard,
    Reward,
} from './expedition.interface';
import { Node } from './node';
import { Player } from './player';
import { ExpeditionActConfig } from './expeditionActConfig.schema';
import { EncounterInterface } from '../encounter/encounter.interfaces';
import { Score } from './scores';
import { ScoreResponse } from 'src/game/scoreCalculator/scoreCalculator.service';
import { Contest } from 'src/game/contest/contest.schema';

export type ExpeditionDocument = HydratedDocument<Expedition>;

export interface IPlayerToken {
    walletId: string;
    contractId: string;
    tokenId: number;
}

@modelOptions({
    schemaOptions: { collection: 'maps', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
class MapType {
    @Prop()
    _id: ObjectId; // Asegúrate de que esta propiedad tiene el tipo ObjectId
    // Otras propiedades de MapType

    @Prop()
    map: Node[]; // O el tipo correcto para los nodos de tu mapa, reemplaza Node[] con el tipo correcto

}

export { MapType };

const MapTypeSchema: Schema = new Schema({
    // Campos y tipos de datos de tu esquema MapType
});


export const MapTypeModel = mongoose.model<MapType>('MapType', MapTypeSchema);


@modelOptions({
    schemaOptions: { collection: 'expeditions', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class Expedition {
    @Prop()
    clientId?: string;

    @Prop()
    userAddress: string;

    @Prop()
    actConfig?: ExpeditionActConfig;

    @Prop()
    scores?: Score;

    @Prop()
    mapSeedId?: number;

    @Prop({ ref: MapType }) // Indica que este campo es una referencia a MapType
    map: Ref<MapType>; // El tipo Ref<T> se utiliza para campos de referencia en typegoose

    @Prop()
    playerState: Player;

    @Prop()
    finalScore?: ScoreResponse;

    @Prop({ type: Object })
    currentNode?: {
        nodeId: number;
        nodeType: NodeType;
        nodeSubType?: NodeType;
        completed: boolean;
        showRewards: boolean;
        data?: {
            round: number;
            playing: CombatTurnEnum;
            player: {
                energy: number;
                energyMax?: number;
                handSize: number;
                defense: number;
                hpCurrent: number;
                hpMax: number;
                cards: {
                    hand: IExpeditionPlayerStateDeckCard[];
                    draw: IExpeditionPlayerStateDeckCard[];
                    discard: IExpeditionPlayerStateDeckCard[];
                    exhausted: IExpeditionPlayerStateDeckCard[];
                };
                statuses: {
                    [StatusType.Buff]: AttachedStatus[];
                    [StatusType.Debuff]: AttachedStatus[];
                };
            };
            enemies: IExpeditionCurrentNodeDataEnemy[];
            rewards: Reward[];
        };
        merchantItems?: MerchantItems;
        treasureData?: TreasureInterface;
        encounterData?: EncounterInterface;
    };

    @Prop({ type: Object })
    contest: Contest;

    @Prop({
        default: ExpeditionStatusEnum.InProgress,
        type: String,
        enum: ExpeditionStatusEnum,
    })
    status: ExpeditionStatusEnum;

    @Prop({ default: false })
    isCurrentlyPlaying: boolean;

    @Prop()
    createdAt: Date;

    @Prop()
    /**
     * @Deprecated use endedAt instead
     */
    defeatedAt?: Date;

    @Prop()
    /**
     * @Deprecated use endedAt instead
     */
    completedAt?: Date;

    @Prop()
    endedAt?: Date;
}
