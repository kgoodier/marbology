import BoardSolver from './BoardSolver';

export type Direction = 'top' | 'right' | 'bottom' | 'left' | '';

// This is mostly immutable, as it should be. Unfortunately the ballColor is mutable. TODO: fix this.
export type TileState = {
  ballColor?: string, // single character for color, or undefined for no ball
  isEmpty: boolean, // no tile present in this board space
  siblingDirection?: Direction, // undefined if square, else this is a rectangular piece
  divotColor?: string, // single character for color, or undefined for divot
  exits: Array<boolean> // top, right, bottom, left
};

export type Coord = {
  x: number,
  y: number
};

export type Move = {
  from: Coord,
  to: Coord,
  type: 'tile' | 'ball'
};

export type BoardRecord = {
  name: string,
  parent?: BoardRecord,
  children: Array<BoardRecord>,
  depth: number,
  solver: BoardSolver,
};

export type Solutions = {
  name: string,
  children: Array<Solutions>,
};

export type SolverStats = {
  status: 'NotStarted' | 'Running' | 'Done' | 'Error',
  message?: string,
  iterations: number,
  loops: number,
  branches: number,
  depth: number,
  unexplored: number,
}
