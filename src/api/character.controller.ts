import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Character } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@ApiBearerAuth()
@ApiTags('Characters')
@Controller('characters')
@UseGuards(new AuthGuard())
export class CharacterController {
    constructor(private readonly prisma: PrismaService) {}

    @ApiOperation({
        summary: 'Get all characters',
    })
    @Get()
    async handleGetAllCharacters(): Promise<Character[]> {
        return await this.prisma.character.findMany({
            include: { cardpool: true },
        });
    }
}
