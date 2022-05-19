import { ExpeditionMapNodeTypeEnum } from 'src/game/expedition/enums';
import Node from '../node';

class Empty extends Node {
    constructor(
        id: number,
        act: number,
        step: number,
        type: ExpeditionMapNodeTypeEnum,
        private_data: any,
    ) {
        super(id, act, step, type, private_data);
    }
}

export default Empty;
