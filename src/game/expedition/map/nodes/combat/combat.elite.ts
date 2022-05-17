import Combat from './combat';

class CombatElite extends Combat {
    constructor(id: number, act: number, step: number, type: string, private_data: any) {
        super(id, act, step, type, private_data);
    }
}

export default CombatElite;
