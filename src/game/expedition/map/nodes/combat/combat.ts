import { ExpeditionMapNodeTypeEnum } from 'src/game/expedition/enums';
import Node from '../node';

class Combat extends Node {
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
        this.state.enemy =
            this.private_data.enemies[
                Math.floor(Math.random() * this.private_data.enemies.length)
            ];
        return this.state;
    }
}

export default Combat;
