import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import Node from '../node';

class Empty extends Node {
    constructor(
        id: number,
        act: number,
        step: number,
        type: ExpeditionMapNodeTypeEnum,
        subType: ExpeditionMapNodeTypeEnum,
        private_data: any,
    ) {
        super(id, act, step, type, subType, private_data);
    }
}

export default Empty;