export type Direction = 'top' | 'right' | 'bottom' | 'left' | '';

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

export type SolverStats = {
  status: 'NotStarted' | 'Running' | 'Done' | 'Error',
  message?: string,
  iterations: number,
  loops: number,
  branches: number,
  depth: number,
}