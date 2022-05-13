import Camp from './camp';

class CampHouse extends Camp {
    minHouseId: number;
    maxHouseId: number;

    constructor() {
        super();
        this.minHouseId = 0;
        this.maxHouseId = 3;
    }

    private calculateHouseId(): number {
        return Math.floor(
            Math.random() * (this.maxHouseId - this.minHouseId + 1) +
                this.minHouseId,
        );
    }

    public stateInitialize(): any {
        this.baseState.house_id = this.calculateHouseId();
        return this.baseState;
    }
}

export default CampHouse;
