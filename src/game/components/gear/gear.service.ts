import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Gear } from './gear.schema';

@Injectable()
export class GearService {
    constructor(
        @InjectModel(Gear)
        private readonly encounterModel: ReturnModelType<typeof Gear>,
    ) {}
}
