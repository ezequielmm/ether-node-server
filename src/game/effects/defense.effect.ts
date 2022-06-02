import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { DefenseDTO } from './dto';
import { IBaseEffect } from './interfaces/baseEffect';

@Injectable()
export class DefenseEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DefenseDTO): Promise<void> {
        await this.expeditionService.setPlayerDefense(payload);
    }
}
