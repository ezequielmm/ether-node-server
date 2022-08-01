import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';

export class CardDescriptionFormatter {
    static process(card: IExpeditionPlayerStateDeckCard): string {
        // First we deestructure the effect array
        const {
            properties: { effects },
        } = card;

        // Next we loop over all the effects to find the value on the text
        // and update it with the correct value
        effects.forEach(({ effect: name, args: { value } }) => {
            card.description = card.description.replace(
                `{${name}}`,
                value.toString(),
            );
        });

        // Finally we return the card with the next description
        return card.description;
    }
}
