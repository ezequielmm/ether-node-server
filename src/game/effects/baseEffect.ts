import { BaseEffectDTO } from './dto';

export interface IBaseEffect {
    handle: (...args: BaseEffectDTO[]) => Promise<void>;
}
