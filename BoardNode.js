class BoardNode {
  constructor(data) {
    this.data = data ? data : null;
    this.neighbors = [];
  }
}

export default BoardNode;
