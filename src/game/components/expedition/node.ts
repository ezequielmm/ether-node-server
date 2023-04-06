import { Item } from 'src/game/merchant/merchant.interface';
import { NodeType } from './node-type';
import { NodeStatus } from './node-status';
import { modelOptions, Prop, Severity } from '@typegoose/typegoose';

@modelOptions({
    options: { allowMixed: Severity.ALLOW }
})
export class Node {
    constructor(partial: Partial<Node>) {
        Object.assign(this, partial);
    }

    @Prop()
    id: number;

    @Prop()
    act: number;

    @Prop()
    step: number;

    @Prop()
    type: NodeType;

    @Prop()
    subType: NodeType;

    @Prop()
    status: NodeStatus;

    @Prop()
    exits: number[];

    @Prop()
    enter: number[];

    @Prop()
    title?: string;

    @Prop()
    private_data?: {
        cards?: Item[];
        neutralCards?: Item[];
        trinkets?: Item[];
        potions?: Item[];
        enemies?: {
            enemies: number[];
            probability: number;
        }[];
    } & any;

    @Prop()
    state?: {
        treasure?: any;
        enemies?: {
            enemies: number[];
            probability: number;
        }[];
    } & any;

    isAvailable(): boolean {
        return this.status === NodeStatus.Available;
    }

    isActive(): boolean {
        return this.status === NodeStatus.Active;
    }

    isCompleted(): boolean {
        return this.status === NodeStatus.Completed;
    }

    isDisabled(): boolean {
        return this.status === NodeStatus.Disabled;
    }

    isSelectable(): boolean {
        return this.isAvailable() || this.isActive();
    }
}
