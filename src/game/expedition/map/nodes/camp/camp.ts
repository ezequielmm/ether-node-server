import Node from "../node";

class Camp extends Node {
  constructor() {
    super();
    if (new.target === Camp) {
      throw TypeError("Cannot create instance of Camp class");
    }
  }
}

export default Camp;
