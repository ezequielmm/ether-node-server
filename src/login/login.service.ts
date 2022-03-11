import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../login/dto/login.dto';
import * as argon from 'argon2';
import { Tokens } from './types';

@Injectable()
export class LoginService {
    constructor(
        private prisma: PrismaService,
        private jwtTokenService: JwtService,
    ) {}

    /**
     * check for user login
     * @version 1
     * @returns userProfile, token
     */
    async login_V1(data: LoginDto) {
        const tokens = await this.getTokens(data.id, data.email);
        await this.setCurrentRefreshToken(tokens.refresh_token, data.id);
        return {
            ...tokens,
            profile: data,
        };
    }

    /**
     * refresh authentication token
     * @version 1
     * @returns userProfile, token
     */
    async refreshToken_V1(userId: string, token: string) {
        const user = await this.prisma.profile.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !user.refresh_token)
            throw new ForbiddenException('Access Denied');

        const rtMatch = await argon.verify(user.refresh_token, token);

        if (!rtMatch) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(userId, user.email);

        await this.setCurrentRefreshToken(tokens.refresh_token, userId);

        return tokens;
    }

    /**
     * validate user login
     * @version 1
     * @returns userProfile, token
     **/

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.profile.findUnique({
            where: { email },
        });

        if (user && user.password === pass) {
            const { password, refresh_token, ...result } = user;
            return result;
        }
        return null;
    }
    /**
     * Update refresh token
     * @param refresh_token
     * @param userId
     * @returns refresh_token
     */

    async setCurrentRefreshToken(refresh_token: string, userId: string) {
        const hash = await argon.hash(refresh_token);
        const profile = await this.prisma.profile.update({
            where: { id: userId.toString() },
            data: {
                refresh_token: hash,
            },
        });
        return profile.refresh_token;
    }

    /**
     * get tokens
     * @param userId
     * @param email
     * @returns access_token, refresh_token
     */

    async getTokens(userId: string, email: string): Promise<Tokens> {
        const jwtPayload = {
            sub: userId,
            email: email,
        };

        const [access_token, refresh_token] = await Promise.all([
            this.jwtTokenService.signAsync(jwtPayload, {
                expiresIn: `${process.env.AUTH_TOKEN_DURATION || 30}d`,
                secret: `${process.env.ACCESS_TOKEN_SECRET_KEY}`,
            }),
            this.jwtTokenService.signAsync(jwtPayload, {
                expiresIn: `${process.env.REFRESH_TOKEN_DURATION || 31}d`,
                secret: `${process.env.REFRESH_TOKEN_SECRET_KEY}`,
            }),
        ]);

        return {
            access_token,
            refresh_token,
        };
    }
}
