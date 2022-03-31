import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @ApiProperty()
    id: string;
    @IsNotEmpty()
    @ApiProperty()
    @MinLength(1)
    @MaxLength(250)
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(1)
    @MaxLength(250)
    password: string;
}
