import { ErrorBehavior } from 'src/socket/custom.exception';
import { SerializeType } from './../../response/activityLog';

export interface ActionError {
    message?: string;
    behavior?: ErrorBehavior;
}
export interface ActionResponse {
    name: string;
    activities: SerializeType;
    stateDelta?: any;
    error?: ActionError;
}

export interface LogActivityOptions {
    blockName?: string;
}
