import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../login/dto/login.dto';
import { Profile, Prisma } from '@prisma/client';

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
        const refresh_token = await this.generateRefreshToken(data);
        return {
            access_token: this.jwtTokenService.sign(data),
            refresh_token,
            profile: data,
        };
    }

    async generateRefreshToken(data: LoginDto) {
        const refreshToken = await this.jwtTokenService.sign(data, {
            expiresIn: `${process.env.REFRESH_TOKEN_DURATION || 31}d`,
            secret: `${process.env.REFRESH_TOKEN_SECRET_KEY}`,
        });
        return await this.setCurrentRefreshToken(refreshToken, data.id);
    }

    /**
     * refresh authentication token
     * @version 1
     * @returns userProfile, token
     */
    async refreshToken_V1(token: string) {
        try {
            const profile = await this.jwtTokenService.verify(token, {
                secret: process.env.REFRESH_TOKEN_SECRET_KEY,
            });
            if (profile) {
                return {
                    access_token: this.jwtTokenService.sign({
                        id: profile.id,
                        email: profile.email,
                    }),
                    refresh_token: token,
                    profile: profile as Profile,
                };
            }
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return false;
            } else if (error.name === 'TokenExpiredError') {
                return {
                    token,
                    refresh_token: this.jwtTokenService.sign({
                        email: '',
                        password: '',
                    }),
                };
            }
            throw new InternalServerErrorException();
        }
    }
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
    async setCurrentRefreshToken(refresh_token: string, userId: string) {
        const profile = await this.prisma.profile.update({
            where: { id: userId.toString() },
            data: {
                refresh_token,
            },
        });
        return profile.refresh_token;
    }
}
