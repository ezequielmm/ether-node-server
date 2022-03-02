import { Injectable } from '@nestjs/common';
import { Enemy } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EnemyService {
    constructor(private prisma: PrismaService) {}

    /**
     * Get all the enemies
     * @version 1
     * @param characterWhereUniqueInput
     * @returns character | null
     */
    async getAllCharacters_V1(): Promise<Enemy[]> {
        return await this.prisma.enemy.findMany();
    }
}
