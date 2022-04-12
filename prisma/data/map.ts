import { ExpeditionMapNodeTypeEnum } from 'src/enums/expeditionMapNodeType.enum';
import { ExpeditionMapInterface } from 'src/interfaces/expeditionMap.interface';

export const map: ExpeditionMapInterface[] = [
    {
        act: 0,
        step: 0,
        id: 1,
        type: ExpeditionMapNodeTypeEnum.Combat,
        exits: [3, 4],
        enter: null,
    },
    {
        act: 0,
        step: 0,
        id: 2,
        type: ExpeditionMapNodeTypeEnum.Combat,
        exits: [4],
        enter: null,
    },
    {
        act: 0,
        step: 1,
        id: 3,
        type: ExpeditionMapNodeTypeEnum.Combat,
        exits: [5],
        enter: [1],
    },
    {
        act: 0,
        step: 1,
        id: 4,
        type: ExpeditionMapNodeTypeEnum.Combat,
        exits: [5],
        enter: [1, 2],
    },
    {
        act: 0,
        step: 2,
        id: 5,
        type: ExpeditionMapNodeTypeEnum.Combat,
        exits: [6, 7, 8],
        enter: [3, 4],
    },
    {
        act: 1,
        step: 0,
        id: 6,
        type: ExpeditionMapNodeTypeEnum.Combat,
        exits: [],
        enter: [5],
    },
    {
        act: 1,
        step: 0,
        id: 7,
        type: ExpeditionMapNodeTypeEnum.Combat,
        exits: [],
        enter: [5],
    },
    {
        act: 1,
        step: 0,
        id: 8,
        type: ExpeditionMapNodeTypeEnum.Combat,
        exits: [],
        enter: [5],
    },
];
