import { StateManagerService } from './../stateManager/stateManager.service';
import { EventManagerService } from './../eventManager/eventManager.service';
import {
    ActionError,
    ActionResponse,
    LogActivityOptions,
} from './interfaces/index';
import { ActivityLogService } from './../response/activityLog.service';
import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { Activity } from '../elements/prototypes/activity';
import * as _ from 'lodash';
import { ErrorBehavior } from 'src/socket/custom.exception';

@Injectable()
export class GameManagerService {
    private readonly lastActionByClientId = new Map<string, Action>();

    constructor(
        private readonly activityLogService: ActivityLogService,
        private readonly eventManagerService: EventManagerService,
        private readonly stateManagerService: StateManagerService,
    ) {}

    public async startAction(clientId: string, name: string): Promise<Action> {
        const activityLog = this.activityLogService.findOneByClientId(clientId);
        activityLog.clear();

        await this.stateManagerService.snapshot(clientId);

        const action = new Action(clientId, name, this);
        this.lastActionByClientId.set(clientId, action);

        return action;
    }

    public async endAction(
        clientId: string,
        name: string,
        error?: ActionError,
    ): Promise<ActionResponse> {
        const activityLog = this.activityLogService.findOneByClientId(clientId);
        if (this.eventManagerService.isProcessing(clientId)) {
            await this.eventManagerService.wait(clientId);
        }

        const stateDelta = this.stateManagerService.getDiff(clientId);
        const activities = activityLog.serialize();

        const response: ActionResponse = {
            name,
            activities,
            error,
        };

        if (error && error.behavior === ErrorBehavior.ApplyDiff) {
            response.stateDelta = stateDelta;
        }

        return response;
    }

    public getLastActionByClientId(clientId: string): Action {
        return this.lastActionByClientId.get(clientId);
    }

    public async logActivity(
        clientId: string,
        activity: Activity,
        options: LogActivityOptions = {},
    ): Promise<void> {
        const activityLog = this.activityLogService.findOneByClientId(clientId);
        const blockName = options.blockName || _.uniqueId('block-');

        activityLog.addActivity(blockName, activity);

        // Apply state delta to expedition state
        for (const stateDelta of activity.state_delta) {
            await this.stateManagerService.modify(clientId, stateDelta);
        }
    }
}
