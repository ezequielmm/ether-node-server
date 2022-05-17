import Combat from './combat';

class CombatBoss extends Combat {
    constructor(id: number, act: number, step: number, type: string, private_data: any) {
        super(id, act, step, type, private_data);
    }
}

export default CombatBoss;
