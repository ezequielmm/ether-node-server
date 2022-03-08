import { Controller, Post, Version,Body,Res,Headers } from '@nestjs/common';
import { Response } from 'express';
import { LoginService } from './login.service';
import { LoginDto } from '../login/dto/login.dto';

@Controller()
export class LoginController {
    constructor(private readonly service: LoginService) {}

    @Version('1')
    @Post('/login')
    async login_V1(@Body() data: LoginDto,@Res() response: Response){
        try {
            const loggedInUser =await this.service.login_V1(data); 
            if(!loggedInUser)   {
                return response.status(401).json({statusCode:401,message:'Un-authorized',data:{}});
            }
            return response.status(200).json({statusCode:200,message:'Success',data:loggedInUser});
        } catch (error) {
            response.status(500).json({statusCode:500,message:'Internal Server Error',data:{}});
        }
    }

    @Version('1')
    @Post('token/refresh')
    async refreshToken_V1(@Headers('Authorization') token: string,@Body() data: LoginDto,@Res() response: Response){
        try {
            const refreshedToken =await this.service.refreshToken_V1(data,token); 
            if(!refreshedToken)   {
                return response.status(401).json({statusCode:401,message:'Un-authorized',data:{}});
            }   
            return response.status(200).json({statusCode:200,message:'Success',data:refreshedToken});
        } catch (error) {
            response.status(500).json({statusCode:500,message:'Internal Server Error',data:{}});
        }
    }
}