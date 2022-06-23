import { BaseEffectDTO } from '../dto';

export interface IBaseEffect {
    handle: (...args: BaseEffectDTO[]) => Promise<any>;
}

export enum EffectName {
    Damage = 'damage',
    Defense = 'defense',
    Energy = 'energy',
    DrawCard = 'drawCard',
    AddCard = 'addCard',
    ModifyHPMax = 'modifyHPMax',
}

export interface JsonEffect {
    name: EffectName;
    args: object;
}
