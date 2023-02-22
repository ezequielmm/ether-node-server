import { Card } from '../components/card/card.schema';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';

export class CardDescriptionFormatter {
    public static process(card: IExpeditionPlayerStateDeckCard | Card): string {
        // First we deestructure the effect array
        const {
            properties: { effects, statuses },
        } = card;

        // Next we loop over all the effects to find the value on the text
        // and update it with the correct value
        effects.forEach(({ effect: name, args }) => {
            card.description = card.description.replace(
                `{${name}}`,
                args?.value?.toString(),
            );
        });

        // Next we loop over all the statuses to find the value on the text
        // and update it with the correct value
        statuses.forEach(({ name, args: { counter: value } }) => {
            card.description = card.description
                .replace(`{${name}}`, value.toString())
                .replace(`[${name}]`, `<color=#0066cc>${name}</color>`);
        });

        // Finally we return the card with the next description
        return card.description;
    }
}
