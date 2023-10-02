import { sign, JwtPayload, SignOptions, verify } from 'jsonwebtoken';

const signingSecret = 'TEMPORARY_SECRET';

export type JwtType = 'session' | 'nonce';

export type JsonWebToken = string;

export const signSessionJwt = (address: string): JsonWebToken => {
    return signJwt('session', { sub: address }, { expiresIn: '1w' });
};

export const signNonceJwt = (nonce: string): JsonWebToken => {
    return signJwt('nonce', { sub: nonce }, { expiresIn: '1h' });
};

export const verifyNonceJwt = (token: JsonWebToken): string => {
    const { sub: nonce } = verifyJwt('nonce', token);
    return nonce;
};

export const verifySessionJwt = (token: JsonWebToken): string => {
    const { sub: address } = verifyJwt('session', token);
    return address;
};

export const signJwt = (
    type: JwtType,
    payload: JwtPayload,
    options: SignOptions,
): JsonWebToken => {
    return sign({ ...payload, type }, signingSecret, options);
};

export const verifyJwt = (type: JwtType, token: JsonWebToken): JwtPayload => {
    const payload = verify(token, signingSecret) as JwtPayload;
    if (payload.type !== type) {
        throw new Error(
            `JWT type doesn't match: got ${payload.type}, expected: ${type}`,
        );
    }
    return payload;
};
