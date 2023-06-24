import type { Coord, Move, TileState } from './types';
import assert from './assert';

export default class BallPather {
  tiles: Array<Array<TileState>>

  // Reset each explore
  seenTiles: Set<TileState>

  constructor(tiles: Array<Array<TileState>>) {
    this.tiles = tiles;
    this.seenTiles = new Set();
  }

  explorePathsFrom(from: Coord): Array<Move> {
    this.seenTiles = new Set();
    const moves = this._exploreExits(from);
    // TODO: maybe > 1 is ok?
    //assert(moves.length <= 1, `expected 0 or 1 possible moves for the ball at (${from.x}, ${from.y}), got ${JSON.stringify(moves)}`);
    return moves;
  }

  /**
   * Find adjacent locations the ball might move to.
   * 
   * @param from Starting location of the tile containing the ball.
   * @returns List of valid ending locations for the ball. TODO: should only be 1?
   */
  _exploreExits(from: Coord): Array<Move> {
    var moves: Array<Move> = [];
    const tile = this.tiles[from.y][from.x];
    if (this.seenTiles.has(tile)) {
      // Been there, done that.
      return moves;
    }
    this.seenTiles.add(tile);

    if (tile.exits[0]) {
      moves.push(...this._moveBall(from, { x: from.x, y: from.y - 1 }));
    }
    if (tile.exits[1]) {
      moves.push(...this._moveBall(from, { x: from.x + 1, y: from.y }));
    }
    if (tile.exits[2]) {
      moves.push(...this._moveBall(from, { x: from.x, y: from.y + 1 }));
    }
    if (tile.exits[3]) {
      moves.push(...this._moveBall(from, { x: from.x - 1, y: from.y }));
    }
    return moves;
  }

  _moveBall(from: Coord, to: Coord): Array<Move> {
    const tile = this.tiles[to.y][to.x];

    if (this.seenTiles.has(tile)) {
      // Already been here, bail
      return [];
    }
    this.seenTiles.add(tile);

    // Does the "to" tile have a ball already? Bail.
    if (tile.ballColor) {
      return [];
    }

    // Does the "to" tile have a divot? Record move and stop.
    if (tile.divotColor) {
      const move: Move = { from: from, to, type: 'ball' };
      return [move];
    }

    // Should be exits if there is no divot, so let's go check them recursively
    return this._exploreExits(to);
  }

}