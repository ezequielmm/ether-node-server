import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { ModifyHPMaxDTO } from './dto';
import { IBaseEffect } from './interfaces/baseEffect';

@Injectable()
export class ModifyHPMaxEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: ModifyHPMaxDTO): Promise<void> {
        await this.expeditionService.modifyHPMaxValue(payload);
    }
}
