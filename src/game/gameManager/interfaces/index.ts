import { SerializeType } from './../../response/activityLog';

export interface ActionResponse {
    name: string;
    activities: SerializeType;
    stateDelta: any;
}

export interface LogActivityOptions {
    blockName?: string;
}
