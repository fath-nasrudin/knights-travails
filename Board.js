import BoardNode from './BoardNode.js';
import PathNode from './PathNode.js';

class Board {
  constructor() {
    this.board = null;
  }

  /**
   *  generate board of row * col and then populate it array of cells for the possible moves for the knight, and save it to the `board` property.
   * @param {*} rowLength the row length. default is 8
   * @param {*} colLength the col length. if its falsy, set to be equal with the row lengh
   */
  generateKnightsBoard(rowLength = 8, colLength = null) {
    if (!colLength) colLength = rowLength;

    this.generateBoard(rowLength, colLength);
    this.populateKnightNeighbors();
  }

  /**
   *  generate board of row * col and save to the `board` property.
   * @param {*} rowLength the row length. default is 8
   * @param {*} colLength the col length. if its falsy, set to be equal with the row lengh
   */
  generateBoard(rowLength = 8, colLength = null) {
    if (!colLength) colLength = rowLength;

    const board = [];
    for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
      let tempRow = [];
      for (let colIndex = 0; colIndex < colLength; colIndex++) {
        const data = { coordinate: [rowIndex, colIndex], rowIndex, colIndex };
        tempRow.push(new BoardNode(data));
      }
      board.push(tempRow);
      tempRow = [];
    }
    this.board = board;
  }

  /**
   * populate each cell of generated board with possible knight move (L shape) as array of neighbors.
   */
  populateKnightNeighbors() {
    const board = this.board;
    board.forEach((row) =>
      row.forEach((cell) => {
        const row = cell.data.rowIndex;
        const col = cell.data.colIndex;
        // look for top neighbors

        const top = board[row - 2];
        if (top) {
          if (top[col + 1]) cell.neighbors.push(top[col + 1]);
          if (top[col - 1]) cell.neighbors.push(top[col - 1]);
        }

        const bottom = board[row + 2];
        if (bottom) {
          if (bottom[col + 1]) cell.neighbors.push(bottom[col + 1]);
          if (bottom[col - 1]) cell.neighbors.push(bottom[col - 1]);
        }

        // check left node
        if (board[row + 1] && board[row + 1][col - 2]) {
          cell.neighbors.push(board[row + 1][col - 2]);
        }
        if (board[row - 1] && board[row - 1][col - 2]) {
          cell.neighbors.push(board[row - 1][col - 2]);
        }

        // check right
        if (board[row + 1] && board[row + 1][col + 2]) {
          cell.neighbors.push(board[row + 1][col + 2]);
        }
        if (board[row - 1] && board[row - 1][col + 2]) {
          cell.neighbors.push(board[row - 1][col + 2]);
        }
      })
    );
  }

  /**
   *
   * @param {*} coordinate coordinates [[row, col], [row, col]]. first element is coordinate of knight place, second element is coordinate of the knight destination.
   * @param {*} maxPath maximal of how many paths you want. default to 1;
   * @returns {array} array of paths
   */
  findShortestPaths(coordinate = [], maxPath = 1) {
    if (!coordinate || coordinate.length !== 2) {
      throw Error('Need valid coordinate. example: [[0,0], 1,1]');
    }
    // suppose the coordinate is valid
    const knightPlace = this.board[coordinate[0][0]][coordinate[0][1]];
    const destination = this.board[coordinate[1][0]][coordinate[1][1]];

    const rootPath = new PathNode(knightPlace);
    const pathQueue = [rootPath];
    const foundPaths = [];

    while (pathQueue.length && foundPaths.length < maxPath) {
      const path = pathQueue.shift();
      const vertex = path.vertex;

      // for every neighbors of vertex that not yet visited,
      // create as path,
      vertex.neighbors.map((childVertex) => {
        if (!this.checkIsCellVisited(path, childVertex)) {
          const childPath = new PathNode(childVertex);
          childPath.depth = path.depth + 1;
          childPath.parent = path;
          path.addChild(childPath);
          pathQueue.push(childPath);
          if (destination === childVertex) foundPaths.push(childPath);
        }
      });
    }
    return foundPaths;
  }

  /**
   * find is the cell has visited.
   * @param {*} leafPathNode the last path node
   * @param {*} boardCell the cell to be checked
   * @returns {boolean} true if visited, false if is not.
   */
  checkIsCellVisited(leafPathNode, boardCell) {
    let parent = leafPathNode;
    let isVisited = false;
    while (parent) {
      if (parent.vertex === boardCell) {
        isVisited = true;
        break;
      }
      parent = parent.parent;
    }
    return isVisited;
  }

  /**
   * print the path into the console
   * @param {*} path - the leaf node path to track
   * @returns
   */
  getPathLog(path) {
    if (!path) return '';
    return (
      this.getPathLog(path.parent) +
      JSON.stringify(path.vertex.data.coordinate) +
      '\n'
    );
  }

  /**
   * log path
   */
  logPath(path) {
    console.log(`you will get there in ${path.depth} move(s)`);
    console.log(this.getPathLog(path));
  }

  /**
   * logging knight moves of given from the knight place to the knight destination
   * @param {Array} coordinate - example [[0,0], [3,3]]. the first element is knight place. the second element is the knight destination
   */
  printKnightsMoves(coordinate) {
    const shortestPath = this.findShortestPaths(coordinate)[0];
    this.logPath(shortestPath);
  }
}

export default Board;
