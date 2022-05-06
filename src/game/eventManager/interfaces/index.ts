import { ActivityLog } from 'src/game/response/activityLog';

export interface EventUtils {
    activityLog: ActivityLog;
    emitInContext: (event: string, ...args: any[]) => void;
}
