import { ActivityLog } from '../response/activityLog';

export interface EventUtils {
    activityLog: ActivityLog;
    emitInContext: (event: string, ...args: any[]) => void;
}
