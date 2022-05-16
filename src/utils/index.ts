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
