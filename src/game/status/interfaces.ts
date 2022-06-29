import { EffectName } from '../effects/effects.enum';
import { BaseEffectDTO } from '../effects/effects.interface';

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
