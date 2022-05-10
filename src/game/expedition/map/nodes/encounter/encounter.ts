import Node from "../node";

class Encounter extends Node {
  minEncounterId: number;
  maxEncounterId: number;
  defaultSceneId: number;
  constructor() {
    super();
    this.minEncounterId = 0;
    this.maxEncounterId = 24;
    this.defaultSceneId = 0;
  }

  private calcEncounterId(): number {
    return Math.floor(
      Math.random() * (this.maxEncounterId - this.minEncounterId) +
        this.minEncounterId
    );
  }

  public stateInitialize(config: any): any {
    this.baseState.encounte_id = this.calcEncounterId();
    this.baseState.scene_id = config.scene_id
      ? config.scene_id
      : this.defaultSceneId;
    return this.baseState;
  }
}

export default Encounter;
