import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
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
        subType: ExpeditionMapNodeTypeEnum,
        private_data: any,
    ) {
        super(id, act, step, type, subType, private_data);
        this.minEncounterId = 0;
        this.maxEncounterId = 24;
        this.defaultSceneId = 0;
    }
    public select(expeditionMap: ExpeditionMap): void {
        expeditionMap.disableAllNodes();
        this.setActive();
        expeditionMap.activeNode = this;
        this.stateInitialize();
    }

    private calcEncounterId(): number {
        return Math.floor(
            Math.random() * (this.maxEncounterId - this.minEncounterId) +
                this.minEncounterId,
        );
    }

    protected stateInitialize(): object {
        this.state.encounte_id = this.calcEncounterId();
        this.state.scene_id = this.private_data.scene_id
            ? this.private_data.scene_id
            : this.defaultSceneId;
        return this.state;
    }
}

export default Encounter;
