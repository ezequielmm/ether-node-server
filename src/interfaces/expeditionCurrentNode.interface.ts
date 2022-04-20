import { ExpeditionCurrentNodeDataInterface } from './expeditionCurrentNodeData.interface';

export interface ExpeditionCurrentNodeInterface {
    readonly node_id?: number;
    readonly node_type?: string;
    readonly data?: ExpeditionCurrentNodeDataInterface;
    readonly completed?: boolean;
}
