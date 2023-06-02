export type Direction = 'top' | 'right' | 'bottom' | 'left' | '';

export type TileState = {
  ballColor?: string, // single character for color, or undefined for no ball
  isEmpty: boolean, // no tile present in this board space
  siblingDirection?: Direction, // undefined if square, else this is a rectangular piece
  divotColor?: string, // single character for color, or undefined for divot
  exits: Array<boolean> // top, right, bottom, left
};