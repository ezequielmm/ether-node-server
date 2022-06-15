import { Injectable } from '@nestjs/common';
import { Effect } from './decorators/effect.decorator';
import { BaseEffectDTO } from './dto';
import { IBaseEffect } from './interfaces/baseEffect';

@Effect('damage')
@Injectable()
export class DamageEffect implements IBaseEffect {
    handle: (...args: BaseEffectDTO[]) => Promise<any>;
}
