import { Controller, Get, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Enemy } from '@prisma/client';
import { EnemyService } from './enemy.service';

@ApiTags('Enemies')
@Controller('enemies')
export class EnemyController {
    constructor(private readonly service: EnemyService) {}

    @Version('1')
    @ApiOperation({
        summary: 'Get all enemies',
    })
    @Get()
    async getAllCharacters_V1(): Promise<Enemy[]> {
        return await this.service.getAllCharacters_V1();
    }
}
