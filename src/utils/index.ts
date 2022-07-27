import { random } from 'lodash';
import { IExpeditionPlayerStateDeckCard } from 'src/game/components/expedition/expedition.interface';

/**
 * Validates that the Bearer token is valid
 * @param token The bearer token to validate
 * @return boolean
 */
export function isValidAuthToken(token: string): boolean {
    if (!token) return false;

    token = token.startsWith('Bearer')
        ? token.replace('Bearer', '').trim()
        : token;

    return !token ? false : true;
}

/**
 * Get a random value from an Enum
 * @param anEnum the enum to get the value
 * @return value
 */
export function getRandomEnumValue<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.keys(anEnum) as Array<keyof T>;
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    const randomEnumKey = enumValues[randomIndex];
    return anEnum[randomEnumKey];
}

/**
 * Get a random numeric value from an Enum
 * @param anEnum the enum to get the value
 * @return value
 */
export function getRandomNumericEnumValue<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.keys(anEnum)
        .map((n) => Number.parseInt(n))
        .filter((n) => !Number.isNaN(n)) as unknown as T[keyof T][];
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    const randomEnumValue = enumValues[randomIndex];
    return randomEnumValue;
}

/**
 * Get a random value between a range
 * @param min The starting value
 * @param max The ending value (this is included)
 * @return number
 */
export function getRandomBetween(min: number, max: number): number {
    max = max + 1;
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Checks is input is odd or even number
 */
export function isEven(input: number): boolean {
    return input % 2 === 0;
}

/**
 * Remove cards from a given pile
 * @param originalPile The original card pile
 * @param cardsToRemove The card array to remove from originalPile
 * @return IExpeditionPlayerStateDeckCard[]
 */
export function removeCardsFromPile(payload: {
    originalPile: IExpeditionPlayerStateDeckCard[];
    cardsToRemove: IExpeditionPlayerStateDeckCard[];
}): IExpeditionPlayerStateDeckCard[] {
    const { originalPile, cardsToRemove } = payload;

    return originalPile.filter((drawCard) => {
        return !cardsToRemove.some((handCard) => {
            return drawCard.id === handCard.id;
        });
    });
}

/**
 * Get a random item from an array based on a weight
 * @param items The items to check
 * @param weights The items weights
 * @returns Item
 */
export function getRandomItemByWeight<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((a, b) => a + b);
    const randomWeight = random(0, totalWeight, true);
    let currentWeight = 0;

    for (let i = 0; i < items.length; i++) {
        currentWeight += weights[i];

        if (randomWeight <= currentWeight) return items[i];
    }

    return items[items.length - 1];
}

/**
 * Checks if the value is not undefined and returns its boolean
 * representation
 * @param value the value to evaluate
 * @returns boolean
 * */
export function isNotUndefined(value: boolean): boolean {
    return value !== undefined && value;
}
