import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { TurnChangeDTO } from './dto';
import { IBaseEffect } from './interfaces/baseEffect';

@Injectable()
export class TurnChangeEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: TurnChangeDTO): Promise<void> {
        await this.expeditionService.turnChange(payload);
    }
}
