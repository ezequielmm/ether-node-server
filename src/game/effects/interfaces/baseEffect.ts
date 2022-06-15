import { BaseEffectDTO } from '../dto';

export interface IBaseEffect {
    handle: (...args: BaseEffectDTO[]) => Promise<any>;
}

export interface JsonEffect {
    name: string;
    args: object;
}
