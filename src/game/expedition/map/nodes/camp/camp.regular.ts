import Camp from './camp';

class CampRegular extends Camp {
    constructor(id: number, act: number, step: number, type: string, private_data: any) {
        super(id, act, step, type, private_data);
    }
}

export default CampRegular;
