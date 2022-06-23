import { ExpeditionMapNodeTypeEnum } from 'src/game/expedition/enums';
import ExpeditionMap from '../../map/expeditionMap';
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
    public async select(expeditionMap: ExpeditionMap): Promise<void> {
        expeditionMap.disableAllNodes();
        this.setActive();
        expeditionMap.activeNode = this;
        this.stateInitialize();
        await this.logSelected(expeditionMap.clientId);
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
