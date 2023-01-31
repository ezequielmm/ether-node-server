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
            entropy,
            expires,
        }: {
            sig: string;
            wallet: string;
            entropy: number;
            expires: number;
        },
    ): { isValid: boolean } {
        const timeNow = Math.floor(Date.now() / 1000);

        if (timeNow >= expires) return { isValid: false };

        const hash = `KOTE\nAction: Login\nEntropy: ${entropy}\nExpires: ${expires}`;

        const msgHash = ethers.utils.hashMessage(hash);

        const msgHashBytes = ethers.utils.arrayify(msgHash);

        const recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, sig);

        return {
            isValid: recoveredAddress.toLowerCase() === wallet.toLowerCase(),
        };
    }
}
