import { RoyalHouseTitles } from 'src/game/components/expedition/expedition.enum';
import { NodeType } from 'src/game/components/expedition/node-type';
import { NodeConfig } from '../act.builder';

export const royalHouseD: NodeConfig = {
    type: NodeType.RoyalHouse,
    subType: NodeType.RoyalHouseD,
    data: {},
    title: RoyalHouseTitles.Cynthienne,
};
