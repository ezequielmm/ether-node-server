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
