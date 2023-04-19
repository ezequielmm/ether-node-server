import { IActConfiguration, IActNodeFixedOption } from './mapBuilder.interface';
import { NodeType } from '../../components/expedition/node-type';
import { RoyalHouseTitles } from 'src/game/components/expedition/expedition.enum';

const portalNode: IActNodeFixedOption = {
    type: NodeType.Portal,
    subType: NodeType.Portal,
    nodeConfig: {},
    title: 'Portal',
};

const royalHouseA: IActNodeFixedOption = {
    type: NodeType.RoyalHouse,
    subType: NodeType.RoyalHouseA,
    nodeConfig: {},
    title: RoyalHouseTitles.Rhunn,
};

const royalHouseB: IActNodeFixedOption = {
    type: NodeType.RoyalHouse,
    subType: NodeType.RoyalHouseB,
    nodeConfig: {},
    title: RoyalHouseTitles.Brightflame,
};

const royalHouseC: IActNodeFixedOption = {
    type: NodeType.RoyalHouse,
    subType: NodeType.RoyalHouseC,
    nodeConfig: {},
    title: RoyalHouseTitles.Medici,
};

const royalHouseD: IActNodeFixedOption = {
    type: NodeType.RoyalHouse,
    subType: NodeType.RoyalHouseD,
    nodeConfig: {},
    title: RoyalHouseTitles.Cynthienne,
};

const ActZeroConfig: IActConfiguration = {
    actNumber: 0,

    stepCount: 2,
    maxNodesPerStep: 4,

    stepRangeConfig: {
        'DEFAULT': {
            fixedNodes: [
                    royalHouseA,
                    royalHouseB,
                    royalHouseC,
                    royalHouseD,
            ]
        },
        'FINAL': { 
            fixedNodes: [
                portalNode,
            ]
        },
    },

    nodeOptions: {

    },
};

export { ActZeroConfig };