import { Module } from '@nestjs/common';
import { ShowVersionController } from './showversion.controller';
@Module({
    controllers: [ShowVersionController],
    imports: [],
    providers: [],
})
export class ShowVersionModule {}
