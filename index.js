import Board from './Board.js';
const board = new Board();

board.generateKnightsBoard();
const coordinate = [
  [3, 3],
  [7, 6],
];
board.printKnightsMoves(coordinate);
// output
// you will get there in 3 move(s)
// [3,3]
// [5,2]
// [6,4]
// [7,6]
