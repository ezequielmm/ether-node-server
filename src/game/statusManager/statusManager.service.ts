import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { ItemType } from './types';

@Injectable()
export class StatusManagerService {
    item: ItemType;

    constructor(
        private readonly expeditionService: ExpeditionService,
        item: ItemType,
    ) {
        this.item = item;
    }
}
