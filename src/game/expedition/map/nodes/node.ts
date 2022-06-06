import ExpeditionMap from '../map/expeditionMap';
import { IExpeditionNode } from '../../interfaces';
import {
    ExpeditionMapNodeStatusEnum,
    ExpeditionMapNodeTypeEnum,
} from '../../enums';
import { getApp } from 'src/main';
import { INestApplication } from '@nestjs/common';
import { Activity } from 'src/game/elements/prototypes/activity';

class Node implements IExpeditionNode {
    public id: number;
    public act: number;
    public step: number;
    public type: ExpeditionMapNodeTypeEnum;
    public subType: ExpeditionMapNodeTypeEnum;
    public status: ExpeditionMapNodeStatusEnum;
    public exits: Array<number>;
    public enter: Array<number>;
    public state: any;
    public private_data: any;
    constructor(
        id: number,
        act: number,
        step: number,
        type: ExpeditionMapNodeTypeEnum,
        subType: ExpeditionMapNodeTypeEnum,
        private_data: any,
    ) {
        this.id = id;
        this.act = act;
        this.step = step;
        this.type = type;
        this.subType = subType;
        this.exits = [];
        this.enter = [];
        this.status = ExpeditionMapNodeStatusEnum.Disabled;
        this.private_data = private_data;
        this.state = {};
    }

    public get isActive(): boolean {
        return this.status === ExpeditionMapNodeStatusEnum.Active;
    }

    public get isDisable(): boolean {
        return this.status === ExpeditionMapNodeStatusEnum.Disabled;
    }

    public get isAvailable(): boolean {
        return this.status === ExpeditionMapNodeStatusEnum.Available;
    }

    public get isComplete(): boolean {
        return this.status === ExpeditionMapNodeStatusEnum.Completed;
    }

    public setActive(): void {
        this.status = ExpeditionMapNodeStatusEnum.Active;
    }

    public setDisable(): void {
        this.status = ExpeditionMapNodeStatusEnum.Disabled;
    }

    public setAvailable(): void {
        this.status = ExpeditionMapNodeStatusEnum.Available;
    }

    public setComplete(): void {
        this.status = ExpeditionMapNodeStatusEnum.Completed;
    }

    protected async logSelected(clientId: string): Promise<void> {
        if (clientId)
            await getApp()
                .get('GameManagerService')
                .logActivity(
                    clientId,
                    new Activity('current_node', this.id, 'node-selected', {}, [
                        {
                            mod: 'set',
                            key: 'current_node',
                            val: this,
                            val_type: 'node',
                        },
                    ]),
                );
    }

    protected async logCompleted(clientId: string): Promise<void> {
        // Log the completed node
        if (clientId)
            getApp()
                .get('GameManagerService')
                .logActivity(
                    clientId,
                    new Activity(
                        'current_node',
                        this.id,
                        'node-completed',
                        {},
                        [
                            {
                                mod: 'set',
                                key: 'current_node',
                                val: this,
                                val_type: 'node',
                            },
                        ],
                    ),
                );
    }

    public async select(expeditionMap: ExpeditionMap): Promise<void> {
        expeditionMap.disableAllNodes();
        this.setActive();
        expeditionMap.activeNode = this;
        this.complete(expeditionMap);
        this.stateInitialize();
        await this.logSelected(expeditionMap.clientId);
    }

    public async complete(expeditionMap: ExpeditionMap): Promise<void> {
        this.setComplete();
        this.openExitsNodes(expeditionMap);
        await this.logCompleted(expeditionMap.clientId);
    }

    protected openExitsNodes(expeditionMap: ExpeditionMap): void {
        this.exits.forEach((exit) => {
            expeditionMap.fullCurrentMap.get(exit).setAvailable();
        });
    }

    protected stateInitialize() {
        // TODO: add initialization
    }
}

export default Node;
