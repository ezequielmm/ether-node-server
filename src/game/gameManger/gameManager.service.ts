import { EventManagerService } from './../eventManager/eventManager.service';
import { ActionResponse } from './interfaces/index';
import { ActivityLogService } from './../response/activityLog.service';
import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { Activity } from '../elements/prototypes/activity';

@Injectable()
export class GameManagerService {
    constructor(
        private readonly activityLogService: ActivityLogService,
        private readonly eventManagerService: EventManagerService,
    ) {}

    public startAction(clientId: string, name: string): Action {
        const activityLog = this.activityLogService.findOneByClientId(clientId);
        activityLog.clear();
        // TODO: Take snapshot of current state

        return new Action(clientId, name, this);
    }

    public async endAction(
        clientId: string,
        name: string,
    ): Promise<ActionResponse> {
        const activityLog = this.activityLogService.findOneByClientId(clientId);
        if (this.eventManagerService.isProcessing(clientId)) {
            await this.eventManagerService.wait(clientId);
        }
        // TODO: Get diff between snapshot and current state
        const stateDelta = {};
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
