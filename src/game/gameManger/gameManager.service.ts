import { StateDeltaType } from './../elements/prototypes/types';
import { Response } from './interfaces/index';
import { ActivityLogService } from './../response/activityLog.service';
import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { Activity } from '../elements/prototypes/activity';

@Injectable()
export class GameManagerService {
    constructor(private readonly activityLogService: ActivityLogService) {}

    public startAction(clientId: string, name: string): Action {
        const activityLog = this.activityLogService.findOneByClientId(clientId);
        activityLog.clear();
        // TODO: Take snapshot of current state

        return new Action(clientId, name, this);
    }

    public async endAction(clientId: string, name: string): Promise<Response> {
        const activityLog = this.activityLogService.findOneByClientId(clientId);
        // TODO: Await events to be processed
        // TODO: Get diff between snapshot and current state
        const stateDelta: StateDeltaType = {} as any;
        const activities = activityLog.serialize();

        return {
            name,
            activities,
            stateDelta,
        };
    }

    public logActivity(
        clientId: string,
        entity: any,
        activity: Activity,
    ): void {
        const activityLog = this.activityLogService.findOneByClientId(clientId);
        // Random string id
        const id = Math.random().toString(36).substring(2, 15);
        activityLog.addActivity(id, activity);

        // TODO: Apply activity to entity
    }
}
