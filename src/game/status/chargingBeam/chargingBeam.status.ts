import { Injectable } from "@nestjs/common";
import { StatusEventDTO, StatusEventHandler } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { chargingBeam } from "./constants";

@StatusDecorator({
    status: chargingBeam,
})
@Injectable()
export class ChargingBeamStatus implements StatusEventHandler {
    

    async handle(dto: StatusEventDTO): Promise<any> {
        console.log("*******************************************Charging Beam status")

        const { ctx, update, remove, status, source } = dto;

        // Decrease counter
        status.args.counter--;

        if(status.args.counter !== 0){
            update(status.args);
        }
    }
}