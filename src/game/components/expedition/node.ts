import { Item } from 'src/game/merchant/merchant.interface';
import { NodeType } from './node-type';
import { NodeStatus } from './node-status';
import { Prop } from '@typegoose/typegoose';

export class Node {
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
}
