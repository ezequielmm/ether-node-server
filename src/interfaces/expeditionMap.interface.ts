import { ExpeditionMapNodeTypeEnum } from 'src/enums/expeditionMapNodeType.enum';

export interface ExpeditionMapInterface {
    act: number;
    step: number;
    id: number;
    type: ExpeditionMapNodeTypeEnum;
    exits?: number[];
    enter?: number[];
    private_data?: object;
}
