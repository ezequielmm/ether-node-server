import jwtDecode from 'jwt-decode';
import { random } from 'lodash';
import { IExpeditionPlayerStateDeckCard } from 'src/game/components/expedition/expedition.interface';
import { Node } from 'src/game/components/expedition/node';

/**
 * Gets a bearer token string and removes the word 'Bearer'
 * and trims the final result
 * @param token string - the token to format
 * @return string
 */
export function getBearerToken(token: string): string {
    return token.replace('Bearer', '').trim();
}

/**
 * Validates that the Bearer token is valid
 * @param token The bearer token to validate
 * @return boolean
 */
export function isValidAuthToken(token: string): boolean {
    // First we create a variable to keep track
    // if the token is valid or not, default value
    // is True
    let isValidToken = true;

    // First, we check if the token is not empty
    // otherwise we return false
    if (!token) return false;

    // If we have something, we remove the "Bearer" word
    // to have just the token itself
    token = getBearerToken(token);

    // Next we use jwt-decode to get the header of the
    // token and make sure that is a real token
    // enclosed on a try catch just is case the string is
    // not a JWT token
    try {
        const decodedHeader = jwtDecode<{ typ: string; alg: string }>(token, {
            header: true,
        });

        isValidToken = decodedHeader.typ === 'JWT';
    } catch (e) {
        isValidToken = false;
    }

    // At the end we return the boolean value
    return isValidToken;
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

export function getDecimalRandomBetween(min: number, max: number): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
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
export function removeCardsFromPile({
    originalPile,
    cardsToRemove,
}: {
    originalPile: IExpeditionPlayerStateDeckCard[];
    cardsToRemove: IExpeditionPlayerStateDeckCard[];
}): IExpeditionPlayerStateDeckCard[] {
    return originalPile.filter(
        (originalCard) =>
            !cardsToRemove.some(
                (cardToRemove) => originalCard.id === cardToRemove.id,
            ),
    );
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
 * @param value the param to evaluaye
 * @returns boolean
 * */
export function isNotUndefined(value: boolean | undefined | null): boolean {
    return !!value;
}

/**
 * Type definition for Deep partials
 */
export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

/**
 * Enum for server environments
 */
export enum serverEnvironments {
    development = 'development',
    production = 'production',
}

/**
 * Returns the current UNIX timestamp in seconds
 */
export function getTimestampInSeconds(): number {
    return Math.floor(Date.now() / 1000);
}

/**
 * Get a random number until a given limit
 */
export function getRandomNumber(limit: number): number {
    return Math.floor(Math.random() * limit);
}

/**
 * Convert snake case to title case
 * return string
 */
export function snakeCaseToTitleCase(text: string): string {
    return text
        .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
        .replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());
}

/**
 * Add 1 hour to a given date
 * return Date
 */
export function addHoursToDate(givenDate: Date, hours = 1): Date {
    return new Date(givenDate.getTime() + hours * 60 * 60 * 1000);
}

/**
 * Add x days to a given date
 * return Date
 */
export function addDaysToDate(givenDate: Date, days = 1): Date {
    return new Date(givenDate.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Set hours, minutes and seconds to a given date in UTC
 * return Date
 */
export function setHoursMinutesSecondsToUTCDate(
    givenDate: Date,
    hours = 0,
    minutes = 0,
    seconds = 0,
    ms = 0,
): Date {
    return new Date(
        Date.UTC(
            givenDate.getFullYear(),
            givenDate.getMonth(),
            givenDate.getDate(),
            hours,
            minutes,
            seconds,
            ms,
        ),
    );
}

/**
 * Calculates how many steps are in a map array
 * return number
 */
export function countSteps(map: Node[]): number {
    return map.reduce((acc, node) => {
        if (node.step > acc) return node.step;
        return acc;
    }, 0);
}

/**
 * Calculates the highest number of nodes in a map array grouped by step
 * return number
 */
export function findStepWithMostNodes(nodes: Node[]): number {
    const stepsMap = new Map<number, number>();

    // Count number of nodes in each step
    nodes.forEach((node) => {
        const stepCount = stepsMap.get(node.step) ?? 0;
        stepsMap.set(node.step, stepCount + 1);
    });

    // Find step with highest number of nodes
    let maxCount = 0;
    for (const count of stepsMap.values()) {
        if (count > maxCount) maxCount = count;
    }

    return maxCount;
}

/**
 * Check is the given number is a float or an integer
 * @param value the number to evaluate
 * @returns boolean
 */
export function isFloat(value: number): boolean {
    return (
        typeof value === 'number' &&
        !Number.isNaN(value) &&
        !Number.isInteger(value)
    );
}
