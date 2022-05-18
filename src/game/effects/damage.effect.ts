import { Injectable } from '@nestjs/common';
import { IBaseEffect } from './interfaces/baseEffect';

@Injectable()
export class DamageEffect implements IBaseEffect {}
