import { Injectable, Logger } from '@nestjs/common';
import { ClientId } from '../components/expedition/expedition.type';
import { DiscardAllCardsAction } from './discardAllCards.action';

@Injectable()
export class EndturnAction {
    private readonly logger: Logger = new Logger(EndturnAction.name);

    constructor(
        private readonly discardAllCardsAction: DiscardAllCardsAction,
    ) {}

    async handle(clientId: ClientId): Promise<void> {
        await this.discardAllCardsAction.handle({ clientId });
    }
}
