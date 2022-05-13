import { ActivityLog } from './activityLog';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityLogService {
    private activityLogCollection: {
        [key: string]: ActivityLog;
    };

    constructor() {
        this.activityLogCollection = {};
    }

    /**
     * Returns the activity log for the given client,
     * or creates a new one if it doesn't exist.
     *
     * @param clientId WebSocket client id
     * @param clear If activity log exists, clean it
     * @returns ActivityLog instance
     */
    public findOneByClientId(clientId: string, clear = false): ActivityLog {
        let activityLog = this.activityLogCollection[clientId];

        if (!activityLog) {
            activityLog = new ActivityLog();
            this.activityLogCollection[clientId] = activityLog;
        } else if (clear) {
            activityLog.clear();
        }

        return activityLog;
    }

    /**
     * Clear all the activity logs, useful for testing.
     *
     * @returns void
     */
    public clearAll(): void {
        this.activityLogCollection = {};
    }
}
