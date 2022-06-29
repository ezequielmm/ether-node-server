import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import Camp from './camp';

class CampHouse extends Camp {
    minHouseId: number;
    maxHouseId: number;
    private_data: any;
    state: any;

    constructor(
        id: number,
        act: number,
        step: number,
        type: ExpeditionMapNodeTypeEnum,
        subType: ExpeditionMapNodeTypeEnum,
        private_data: any,
    ) {
        super(id, act, step, type, subType, private_data);
        this.minHouseId = 0;
        this.maxHouseId = 3;
    }

    private calculateHouseId(): number {
        return Math.floor(
            Math.random() * (this.maxHouseId - this.minHouseId + 1) +
                this.minHouseId,
        );
    }

    public stateInitialize(): any {
        this.state.house_id = this.calculateHouseId();
        return this.state;
    }
}

export default CampHouse;
