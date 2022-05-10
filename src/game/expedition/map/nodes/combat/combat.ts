import Node from "../node";

class Combat extends Node {
  constructor() {
    super();
    if (new.target === Combat) {
      throw TypeError("Cannot create instance of Combat class");
    }
  }

  public stateInitialize(config: any): any {
    const enemy =
      config.enemies[Math.floor(Math.random() * config.enemies.length)];
    this.baseState.enemy = enemy;
    return this.baseState;
  }
}

export default Combat;
