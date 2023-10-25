import {
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { generateNonce, SiweMessage } from 'siwe';
import {
    signNonceJwt,
    signSessionJwt,
    verifyNonceJwt,
} from '../utils/tokenHelpers';

export interface AuthenticateSignatureParams {
    nonceToken: JsonWebToken;
    message: string;
    signature: string;
}

export interface AuthenticateTreasureParams {
    id: string;
    walletDecryptKey: string;
    accessToken: string;
}

export type JsonWebToken = string;

@Injectable()
export class AuthService {
    async authenticateSignature({
        nonceToken,
        message,
        signature,
    }: AuthenticateSignatureParams): Promise<JsonWebToken> {
        const nonce = this.nonceFromToken(nonceToken);
        const siweMessage = new SiweMessage(message);
        const fields = await siweMessage.validate(signature);

        if (!nonce) {
            console.error('Authentication failed: nonce missing');
            throw new UnauthorizedException(
                'Authentication failed: nonce not set',
            );
        }

        if (fields.nonce !== nonce) {
            console.error(
                `Invalid nonce: expected ${nonce}, got ${fields.nonce}`,
            );
            throw new UnauthorizedException(
                'Authentication failed: nonce does not match',
            );
        }

        return this.generateToken(fields.address);
    }

    generateNonce(): { nonce: string; nonceToken: JsonWebToken } {
        const nonce = generateNonce();
        const nonceToken = signNonceJwt(nonce);
        return { nonce, nonceToken };
    }

    nonceFromToken(nonceToken: JsonWebToken): string {
        try {
            return verifyNonceJwt(nonceToken);
        } catch (error) {
            console.error('Failed to decode nonce token');
            console.error(error);
            throw new UnprocessableEntityException('Invalid nonce token');
        }
    }

    private generateToken(address: string): string {
        return signSessionJwt(address);
    }
}
