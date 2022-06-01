import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { ItemType } from './types';

@Injectable()
export class StatusManagerService {
    private item: ItemType;
    private isInitialized: boolean;
    private pipeline: [];

    constructor(private readonly expeditionService: ExpeditionService) {
        this.isInitialized = false;
    }

    initialize(item: ItemType) {
        this.item = item;
        this.isInitialized = true;
        this.pipeline = [];
    }

    process() {
        if (!this.isInitialized) {
            throw new ServiceUnavailableException(
                `The state manager is not initialized.`,
            );
        }
    }
}
