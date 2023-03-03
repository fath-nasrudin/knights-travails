class PathNode {
  constructor(vertex) {
    this.vertex = vertex;
    this.parent = null;
    this.children = [];
    this.depth = 0;
  }

  addChild(child) {
    this.children.push(child);
  }
}

export default PathNode;
