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

    public stateInitialize(config: any): any {
        const enemy =
            config.enemies[Math.floor(Math.random() * config.enemies.length)];
        this.state.enemy = enemy;
        return this.state;
    }
}

export default Combat;
