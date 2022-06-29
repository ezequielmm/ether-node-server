import { BaseEffectDTO } from '../effects/dto';
import { EffectName } from '../effects/interfaces/baseEffect';

export enum StatusName {
    Resolve = 'resolve',
    Fortitude = 'fortitude',
}

export enum StatusType {
    Buff = 'buff',
    Debuff = 'debuff',
}

export interface StatusMetadata {
    name: StatusName;
    type: StatusType;
    effects: EffectName[];
}

export interface StatusJson {
    name: StatusName;
    args: object;
}

export interface IBaseStatus {
    handle(dto: BaseEffectDTO, args: any): Promise<BaseEffectDTO>;
}
