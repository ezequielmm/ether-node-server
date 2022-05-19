import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { AddCardToPileDTO } from './dto';
import { IBaseEffect } from './interfaces/baseEffect';

@Injectable()
export class AddCardEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: AddCardToPileDTO): Promise<void> {
        await this.expeditionService.addCardToPile(payload);
    }
}
