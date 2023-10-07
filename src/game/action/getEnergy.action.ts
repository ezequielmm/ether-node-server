import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

@Injectable()
export class GetEnergyAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<number[]> {
        
        const getCurrentNode = await this.expeditionService.getCurrentNode({
            clientId,
        });

        console.warn("TRATANDO DE TOMAR EL CURRENT NODE: " + getCurrentNode);

        if (getCurrentNode !== undefined) {
            const {
                data: {
                    player: { energy, energyMax },
                },
            } = getCurrentNode;
        
            // Ahora puedes usar energy y energyMax aquí
            console.log('Energy:', energy);
            console.log('EnergyMax:', energyMax);

            return [energy, energyMax];
        } else {
            console.log('El objeto data es undefined.');
        }

        
    }
}
