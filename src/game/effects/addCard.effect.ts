import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Effect } from './decorators/effect.decorator';
import { AddCardToPileDTO } from './dto';
import { IBaseEffect } from './interfaces/baseEffect';

@Effect('addCard')
@Injectable()
export class AddCardEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: AddCardToPileDTO): Promise<void> {
        await this.expeditionService.addCardToPile(payload);
    }
}
