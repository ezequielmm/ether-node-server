import { ExpeditionMapNodeTypeEnum } from 'src/game/expedition/enums';
import Node from '../node';

class Encounter extends Node {
    private minEncounterId: number;
    private maxEncounterId: number;
    private defaultSceneId: number;
    constructor(
        id: number,
        act: number,
        step: number,
        type: ExpeditionMapNodeTypeEnum,
        private_data: any,
    ) {
        super(id, act, step, type, private_data);
        this.minEncounterId = 0;
        this.maxEncounterId = 24;
        this.defaultSceneId = 0;
    }

    private calcEncounterId(): number {
        return Math.floor(
            Math.random() * (this.maxEncounterId - this.minEncounterId) +
                this.minEncounterId,
        );
    }

    public stateInitialize(config: any): object {
        this.state.encounte_id = this.calcEncounterId();
        this.state.scene_id = config.scene_id
            ? config.scene_id
            : this.defaultSceneId;
        return this.state;
    }
}

export default Encounter;
