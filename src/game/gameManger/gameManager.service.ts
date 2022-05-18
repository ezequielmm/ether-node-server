import { StateManagerService } from './../stateManager/stateManager.service';
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
        private readonly stateManagerService: StateManagerService,
    ) {}

    public async startAction(clientId: string, name: string): Promise<Action> {
        const activityLog = this.activityLogService.findOneByClientId(clientId);
        activityLog.clear();

        await this.stateManagerService.snapshot(clientId);

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

        const stateDelta = this.stateManagerService.getDiff(clientId);
        const activities = activityLog.serialize();

        return {
            name,
            activities,
            stateDelta,
        };
    }

    public async logActivity(
        clientId: string,
        activity: Activity,
    ): Promise<void> {
        const activityLog = this.activityLogService.findOneByClientId(clientId);
        const id = Math.random().toString(36).substring(2, 15);
        activityLog.addActivity(id, activity);
        for (const stateDelta of activity.state_delta) {
            await this.stateManagerService.modify(clientId, stateDelta);
        }
    }
}
