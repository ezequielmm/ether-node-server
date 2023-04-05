import { find } from 'lodash';
import { Card } from '../components/card/card.schema';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { JsonEffect } from '../effects/effects.interface';

export class CardDescriptionFormatter {
    public static escapeRegExp(s: string): string {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    public static pluralizeByKey(
        s: string,
        key: string,
        value: number,
    ): string {
        return s.replace(
            new RegExp(
                CardDescriptionFormatter.escapeRegExp('{p:' + key + ':') +
                    '([\\w\\s]*)(?::)?([\\w\\s]*)?(?::)?(\\d*)?\\}',
                'g',
            ),
            function (match, singular, plural, threshold) {
                if (!plural) plural = singular + 's';
                if (!threshold) threshold = 2;
                if (value == 0 || value >= threshold) return plural;
                return singular;
            },
        );
    }

    public static replaceAll(s: string, key: string, value: string): string {
        return s.replace(
            new RegExp(CardDescriptionFormatter.escapeRegExp(key), 'g'),
            value,
        );
    }

    public static cardRequiresFormatting(card: IExpeditionPlayerStateDeckCard): boolean {
        return this.requiresFormatting(card.originalDescription ?? card.description);
    }

    public static requiresFormatting(description: string): boolean {
        return /{[^}]+}/.test(description);
    }

    public static cardImpactedByEffectName(card: IExpeditionPlayerStateDeckCard, effectName: string): boolean {
        return this.impactedByEffectName(card.originalDescription ?? card.description, effectName);
    }

    public static impactedByEffectName(description: string, effectName: string): boolean {
        return (description.includes('{'+effectName) || description.includes('{p:'+effectName));
    }

    public static process(card: IExpeditionPlayerStateDeckCard | Card, originalDescription?: string, mutatedEffects?: JsonEffect[]): string {
        // First we deestructure the effect array
        const {
            properties: { effects, statuses },
        } = card;

        let description = originalDescription ?? card.description;

        // Next we loop over all the effects to find the value on the text
        // and update it with the correct value
        effects.forEach(({ effect: name, args, times }) => {
            const mutant = find(mutatedEffects, (m) => m.effect === name);

            description = CardDescriptionFormatter.pluralizeByKey(description, name, mutant?.args?.currentValue ?? args?.value ?? 1);
            description = CardDescriptionFormatter.replaceAll(description, `{${name}}`, mutant?.args?.currentValue?.toString() ?? args?.value?.toString() ?? '');
            if (mutant?.times || times) {
                description = CardDescriptionFormatter.pluralizeByKey(description, name+'|times', mutant?.times ?? times ?? 1);
                description = CardDescriptionFormatter.replaceAll(description, `{${name}|times}`, mutant?.times?.toString() ?? times.toString());
            }
        });

        // Next we loop over all the statuses to find the value on the text
        // and update it with the correct value
        statuses.forEach(({ name, args: { counter: value } }) => {
            description = description
                .replace(`{${name}}`, value.toString())
                .replace(`[${name}]`, `<color=#0066cc>${name}</color>`);
        });

        // Finally we return the card with the next description
        return description;
    }
}
