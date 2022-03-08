import { Injectable,InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../login/dto/login.dto';

@Injectable()
export class LoginService {
    constructor(private prisma: PrismaService,private jwtTokenService: JwtService) {}

    /**
     * check for user login
     * @version 1
     * @returns userProfile, token
     */
     async login_V1(data: LoginDto){
        try {
            const { email,password } = data;
            const result= await this.prisma.profile.findUnique({
                where: {
                  email:email
                }
            }
                );
                if(result&&result.password === password){
                    return {
                        token: this.jwtTokenService.sign({email,password }),
                        profile: { id: "9f3ce210-5edc-4d2c-a33e-19630b101578", name: "John Doe", email: email, coins: 100, fief: 10, wallets: [], expedition: {} }
                    }
                }
                    return false
        } catch (error) {
            throw new InternalServerErrorException()
        }        
    }

    /**
     * refresh authentication token
     * @version 1
     * @returns userProfile, token
     */
     async refreshToken_V1(data: LoginDto,token){
        const { email,password } = data;
         try {
            token=token.split(' ')[1]
            await this.jwtTokenService.verify(token);
            
        return {
            token
        }
         } catch (error) {
             if(error.name==='JsonWebTokenError'){
                return false
             }
             else if(error.name==='TokenExpiredError'){
                 return{
                    token,
            refresh_token: this.jwtTokenService.sign({email,password })
                 }
             }
                throw new InternalServerErrorException()
         }
     }
}


