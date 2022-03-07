import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { NodeService } from './node.service';

@Module({
    imports: [PrismaModule],
    providers: [NodeService],
})
export class NodeModule {}
