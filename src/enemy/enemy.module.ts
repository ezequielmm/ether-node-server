import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { EnemyController } from './enemy.controller';
import { EnemyService } from './enemy.service';

@Module({
    imports: [PrismaModule],
    controllers: [EnemyController],
    providers: [EnemyService],
})
export class EnemyModule {}
