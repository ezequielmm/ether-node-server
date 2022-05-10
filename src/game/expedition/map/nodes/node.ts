class Node {
  baseState: any;
  constructor() {
    if (new.target === Node) {
      throw new TypeError("Cannot create instance of Node class");
    }
    this.baseState = {};
  }

  public stateInitialize(config: any) {
    this.baseState = config;
    return this.baseState;
  }
}

export default Node;
