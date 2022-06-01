import { ExpeditionMapNodeTypeEnum } from 'src/game/expedition/enums';
import Node from '../node';

function calcRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

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
    protected initialize(): any {
        this.state = {
            card_1: {
                card_id: calcRandom(0, 50),
                cost: calcRandom(60, 120),
            },
            card_2: {
                card_id: calcRandom(40, 90),
                cost: calcRandom(80, 140),
            },
            card_3: {
                card_id: calcRandom(80, 130),
                cost: calcRandom(100, 160),
            },
        };
        return this.state;
    }
}

export default Merchant;
