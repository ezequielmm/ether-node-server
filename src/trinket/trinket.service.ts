import { Injectable } from '@nestjs/common';
import { Trinket } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TrinketService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * get all trinkets
     * @returns Trinket[]
     */
    async getTrinkets(): Promise<Trinket[]> {
        return await this.prisma.trinket.findMany({});
    }

    /**
     * get single trinket
     * @param id string
     * @returns get Trinket
     */
    async getTrinket(id: string): Promise<Trinket> {
        return await this.prisma.trinket.findUnique({ where: { id } });
    }
}
