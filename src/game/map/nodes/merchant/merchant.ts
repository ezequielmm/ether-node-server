import Node from '../node';
import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';

class Merchant extends Node {
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

export default Merchant;
