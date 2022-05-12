import { SerializeType } from './../../response/activityLog';

export interface Response {
    name: string;
    activities: SerializeType;
    stateDelta: any;
}
