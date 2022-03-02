import { Controller, Get, Version } from '@nestjs/common';
import { Enemy } from '@prisma/client';
import { EnemyService } from './enemy.service';

@Controller('enemies')
export class EnemyController {
    constructor(private readonly service: EnemyService) {}

    @Version('1')
    @Get('/')
    async getAllCharacters_V1(): Promise<Enemy[]> {
        return await this.service.getAllCharacters_V1();
    }
}
