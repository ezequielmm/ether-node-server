import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ethers } from 'ethers';

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
        const msgHash = ethers.utils.hashMessage(message);

        const msgHashBytes = msgHash;

        const recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, sig);

        return {
            isValid: recoveredAddress.toLowerCase() === wallet.toLowerCase(),
        };
    }
}
