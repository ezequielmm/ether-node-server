import { Module } from '@nestjs/common';
import { ShowVersionController } from './showversion.controller';
import { ShowVersionService } from './showVersion.service';
import { HttpModule } from '@nestjs/axios';
@Module({
    controllers: [ShowVersionController],
    imports: [HttpModule],
    providers: [ShowVersionService],
})
export class ShowVersionModule {}
