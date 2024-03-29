import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ethers } from 'ethers6';

@ApiTags('Tokens')
@Controller('tokens')
export class TokenController {
    @ApiOperation({
        summary: 'Token Gating',
    })
    @Post('/verify')
    handleTokenGating(
        @Body()
        {
            sig,
            wallet,
            message,
        }: {
            sig: string;
            wallet: string;
            created?: number;
            message: string;
        },
    ): { isValid: boolean } {
        const msgHash = ethers.hashMessage(message);

        const msgHashBytes = msgHash;

        const recoveredAddress = ethers.recoverAddress(msgHashBytes, sig);

        return {
            isValid: recoveredAddress.toLowerCase() === wallet.toLowerCase(),
        };
    }
}
