import BoardConfiguration from './BoardConfiguration';

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

export type SolutionState = {
  name: string,
  parent?: SolutionState,
  children: Array<SolutionState>,
  depth: number,
  board: BoardConfiguration,
  move?: Move
};

export type Solutions = {
  name: string,
  children: Array<Solutions>,
  tooltip?: string,
  itemStyle?: any
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
