import { sign, JwtPayload, SignOptions, verify } from 'jsonwebtoken';

export type JwtType = 'session' | 'nonce';

export type JsonWebToken = string;

export const signSessionJwt = (address: string, signingSecret:string ): JsonWebToken => {
    return signJwt('session', { sub: address }, { expiresIn: '1w' }, signingSecret);
};

export const signNonceJwt = (nonce: string, signingSecret:string): JsonWebToken => {
    return signJwt('nonce', { sub: nonce }, { expiresIn: '1h' }, signingSecret);
};

export const verifyNonceJwt = (token: JsonWebToken, signingSecret:string): string => {
    const { sub: nonce } = verifyJwt('nonce', token, signingSecret);
    return nonce;
};

export const verifySessionJwt = (token: JsonWebToken, signingSecret:string): string => {
    const { sub: address } = verifyJwt('session', token, signingSecret);
    return address;
};

export const signJwt = (
    type: JwtType,
    payload: JwtPayload,
    options: SignOptions,
    signingSecret: string
): JsonWebToken => {
    return sign({ ...payload, type }, signingSecret, options);
};

export const verifyJwt = (type: JwtType, token: JsonWebToken, signingSecret:string): JwtPayload => {
    const payload = verify(token, signingSecret) as JwtPayload;
    if (payload.type !== type) {
        throw new Error(
            `JWT type doesn't match: got ${payload.type}, expected: ${type}`,
        );
    }
    return payload;
};
