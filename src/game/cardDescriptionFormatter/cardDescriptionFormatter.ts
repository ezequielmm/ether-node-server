import { Card } from '../components/card/card.schema';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';

export class CardDescriptionFormatter {

    public static escapeRegExp(s: string): string {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    
    public static pluralizeByKey(s: string, key: string, value: number): string {
        return s.replace(
            new RegExp(CardDescriptionFormatter.escapeRegExp('{p:' + key + ':') + '([\\w\\s]*)(?::)?([\\w\\s]*)?(?::)?(\\d*)?\\}','g'),
            function(match, singular, plural, threshold) {
                if (!plural) plural = singular + 's';
                if (!threshold) threshold = 2;
                if (value == 0 || value >= threshold) return plural;
                return singular;
            }    
        );
    }
    
    public static replaceAll(s: string, key: string, value: string): string {
        return s.replace(
            new RegExp(CardDescriptionFormatter.escapeRegExp(key),'g'),
            value
        );
    }

    public static process(card: IExpeditionPlayerStateDeckCard | Card): string {
        // First we deestructure the effect array
        const {
            properties: { effects, statuses },
        } = card;

        // Next we loop over all the effects to find the value on the text
        // and update it with the correct value
        effects.forEach(({ effect: name, args, times }) => {
            card.description = CardDescriptionFormatter.pluralizeByKey(card.description, name, args?.value ?? 1);
            card.description = CardDescriptionFormatter.replaceAll(card.description, `{${name}}`, args?.value?.toString() ?? '');
            if (times) {
                card.description = CardDescriptionFormatter.pluralizeByKey(card.description, name+'|times', times ?? 1);
                card.description = CardDescriptionFormatter.replaceAll(card.description, `{${name}|times}`, times.toString());
            }
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
