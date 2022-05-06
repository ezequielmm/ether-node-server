import { ExpeditionService } from '../../expedition/expedition.service';
import { CardService } from '../../components/card/card.service';
import { Socket } from 'socket.io';

export class CardPlayedAction {
    private readonly expeditionService: ExpeditionService;
    private readonly cardService: CardService;

    async handle(client: Socket, card_id: string): Promise<string> {
        const cardExists = await this.expeditionService.cardExistsOnPlayerHand({
            client_id: client.id,
            card_id,
        });

        // First make sure card exists on player's hand pile

        if (!cardExists)
            return JSON.stringify({
                data: { message: 'Card played is not valid' },
            });

        // Then, we query the card info to get its energy cost
        const { energy: cardEnergy } = await this.cardService.findById(card_id);

        // Then, we get the actual energy amount from the current state
        const {
            data: {
                player: { energy: playerEnergy },
            },
        } = await this.expeditionService.getCurrentNodeByClientId(client.id);

        // Then we make sure that the energy cost for the card is lower that the
        // available energy for the player
        if (cardEnergy > playerEnergy || playerEnergy === 0)
            return JSON.stringify({
                data: { message: 'Not enough energy left' },
            });

        await this.expeditionService.moveCardFromPlayerHandToDiscardPile({
            client_id: client.id,
            card_id,
        });

        const newEnergyAmount = playerEnergy - cardEnergy;

        const { current_node } =
            await this.expeditionService.updatePlayerEnergy({
                client_id: client.id,
                energy: newEnergyAmount,
            });

        return JSON.stringify({ data: current_node });
    }
}
