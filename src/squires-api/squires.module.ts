import { Module } from "@nestjs/common";
import { SquiresService } from "./squires.service";

@Module({
    providers: [SquiresService],
    exports: [SquiresService],
})
export class SquiresModule {}