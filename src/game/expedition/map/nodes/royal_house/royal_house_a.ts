import { ExpeditionMapNodeTypeEnum } from 'src/game/expedition/enums';
import RoyalHouse from './royal_house';

class RoyalHouseA extends RoyalHouse {
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

export default RoyalHouseA;
