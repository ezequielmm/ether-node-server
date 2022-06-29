import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { ClientId } from '../components/expedition/expedition.type';
import { SettingsService } from '../components/settings/settings.service';

@Injectable()
export class DrawCardAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly settingsService: SettingsService,
    ) {}

    async handle(clientId: ClientId) {
        const {
            data: {
                player: {
                    cards: { hand, draw },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId,
        });
    }
}
