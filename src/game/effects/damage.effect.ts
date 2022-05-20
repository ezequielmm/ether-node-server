import { Injectable } from '@nestjs/common';
import { BaseEffectDTO } from './dto';
import { IBaseEffect } from './interfaces/baseEffect';

@Injectable()
export class DamageEffect implements IBaseEffect {
    handle: (...args: BaseEffectDTO[]) => Promise<any>;
}
