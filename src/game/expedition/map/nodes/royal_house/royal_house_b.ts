import { ExpeditionMapNodeTypeEnum } from 'src/game/expedition/enums';
import Node from '../node';

class RoyalHouseB extends Node {
    constructor({
        id,
        act,
        step,
        type,
        private_data,
    }: {
        id: number;
        act: number;
        step: number;
        type: ExpeditionMapNodeTypeEnum;
        private_data: any;
    }) {
        super(id, act, step, type, private_data);
    }
}

export default RoyalHouseB;
