import type { Coord, Direction, Move, TileState } from './types';
import BallPather from './BallPather';
import hashTile from './hashTile';

const verbose = false;

function directionToOffset(dir?: Direction): Coord {
  return {
    x:
      dir === 'left' ? -1 :
        dir === 'right' ? 1 :
          0,
    y:
      dir === 'top' ? -1 :
        dir === 'bottom' ? 1 :
          0
  }
}

export default class BoardSolver {
  tiles: Array<Array<TileState>>
  emptySpaces: Array<Coord>

  constructor(tiles: Array<Array<TileState>>, emptySpaces?: Array<Coord>) {
    this.tiles = tiles;

    if (emptySpaces) {
      this.emptySpaces = emptySpaces;
    } else {
      this.emptySpaces = this._findEmptySpaces(this.tiles);
    }
  }

  clone(): BoardSolver {
    const newTiles: Array<Array<TileState>> = [];
    for (let y = 0; y < this.tiles.length; y++) {
      newTiles.push([]);
      for (let x = 0; x < this.tiles[y].length; x++) {
        // TODO: This is a shallow copy, but we need a deep copy if we're going to mutate the tiles.
        newTiles[y].push({ ...this.tiles[y][x] });
      }
    }
    return new BoardSolver(newTiles, this.emptySpaces);
  }

  hash(): string {
    const hashes: Array<string> = [];
    for (let y = 1; y < this.tiles.length - 1; y++) {
      for (let x = 1; x < this.tiles[y].length - 1; x++) {
        hashes.push(hashTile(this.tiles[y][x]));
      }
    }
    return hashes.join('');
  }

  isDone(): boolean {
    for (let y = 1; y < this.tiles.length - 1; y++) {
      for (let x = 1; x < this.tiles[y].length - 1; x++) {
        const tile = this.tiles[y][x];
        if (tile.ballColor && tile.ballColor !== tile.divotColor) {
          return false;
        }
      }
    }
    console.log(`!!! WE'RE DONE !!!`);
    return true;
  }

  generateMoves(): Array<Move> {
    const moves: Array<Move> = [];
    const seenMoves: Set<string> = new Set();

    if (verbose) {
      //console.log(`generateMoves(), emptySpaces:`, this.emptySpaces);
    }

    const recordTileMoveIfValid = (from: Coord, to: Coord) => {
      //console.log('  recordTileMoveIfValid', from, to);
      const tile: TileState = this.tiles[from.y][from.x];
      if (!tile.isEmpty) {
        const move: Move = { from: { x: from.x, y: from.y }, to: { x: to.x, y: to.y }, type: 'tile' };

        // Normalize to top-most or left-most tile when has sibling
        if (tile.siblingDirection === 'left') {
          move.from.x--;
          move.to.x--;
        }
        if (tile.siblingDirection === 'top') {
          move.from.y--;
          move.to.y--;
        }

        const moveHash = JSON.stringify(move);
        const isDuplicate = seenMoves.has(moveHash);

        // Don't insert duplicates or invalid moves
        if (!isDuplicate && this._isMoveValid(move)) {
          seenMoves.add(moveHash);
          moves.push(move);
        }
      }
    }

    this.emptySpaces.forEach(c => {
      // Direction of move, relative to tile
      recordTileMoveIfValid({ x: c.x, y: c.y - 1 }, c);
      recordTileMoveIfValid({ x: c.x + 1, y: c.y }, c);
      recordTileMoveIfValid({ x: c.x, y: c.y + 1 }, c);
      recordTileMoveIfValid({ x: c.x - 1, y: c.y }, c);
    });

    // Balls
    const ballPather = new BallPather(this.tiles);
    for (let y = 1; y < this.tiles.length - 1; y++) {
      for (let x = 1; x < this.tiles[y].length - 1; x++) {
        const newMoves: Move[] = ballPather.explorePathsFrom({ x, y });

        // TOOD: see if move already existed & skip if so?
        newMoves.forEach(m => seenMoves.add(JSON.stringify(m)));
        moves.push(...newMoves);
      }
    }

    if (verbose) {
      this._audit(`generateMoves(), moves: ${JSON.stringify(moves)}`);
    }

    return moves;
  }

  applyMove(move: Move): Array<BoardSolver> {
    const boards: Array<BoardSolver> = [];
    if (this._isMoveValid(move)) {
      const board = this.clone();
      board.doMove(move)
      boards.push(board);
    }
    return boards;
  }

  doMove(move: Move): void {
    // Assumes moves are valid.
    const fromTile = this.tiles[move.from.y][move.from.x];
    const toTile = this.tiles[move.to.y][move.to.x];

    if (move.type === 'tile') {
      // Offset for sibling tile, or 'undefined' if no sibling
      const sibDelta = directionToOffset(fromTile.siblingDirection);

      if (sibDelta.x !== 0 || sibDelta.y !== 0) {
        const fromSibTile = this.tiles[move.from.y + sibDelta.y][move.from.x + sibDelta.x];
        const toSibTile = this.tiles[move.to.y + sibDelta.y][move.to.x + sibDelta.x];

        this.tiles[move.to.y][move.to.x] = fromTile;
        this.tiles[move.to.y + sibDelta.y][move.to.x + sibDelta.x] = fromSibTile;
        if (toTile.isEmpty) {
          this.tiles[move.from.y + sibDelta.y][move.from.x + sibDelta.x] = toTile;
        } else if (toSibTile.isEmpty) {
          this.tiles[move.from.y][move.from.x] = toSibTile;
        }
      } else {
        this.tiles[move.to.y][move.to.x] = fromTile;
        this.tiles[move.from.y][move.from.x] = toTile;
      }

      /*
      if (move.to.x === 1 && move.to.y === 3) {
        console.log(`  >>> tiles after swap:`);
        for (let j = 0; j < this.tiles.length; j++) {
          for (let i = 0; i < this.tiles[j].length; i++) {
            console.log(`[${i},${j}]:`, JSON.stringify(this.tiles[j][i]));
          }
        }
      }
      */

      // TODO: UGH figure out empty spaces bettttterrrrr
      this.emptySpaces = this._findEmptySpaces(this.tiles);
    } else if (move.type === 'ball') {
      toTile.ballColor = fromTile.ballColor;
      fromTile.ballColor = undefined;
    }
  }

  _findEmptySpaces(tiles: Array<Array<TileState>>): Array<Coord> {
    const emptySpaces: Array<Coord> = [];
    for (let y = 1; y < tiles.length - 1; y++) {
      for (let x = 1; x < tiles[y].length - 1; x++) {
        if (tiles[y][x].isEmpty) {
          const c = { x, y };
          //console.log(`  found empty space:`, c);
          emptySpaces.push(c);
        }
      }
    }
    return emptySpaces;
  }

  _isTileMoveValid(from: Coord, to: Coord): boolean {
    const fromTile = this.tiles[from.y][from.x];
    const toTile = this.tiles[to.y][to.x];

    // Offset for sibling tile, or 'undefined' if no sibling
    const sibDelta = directionToOffset(fromTile.siblingDirection);
    if (sibDelta.x !== 0 || sibDelta.y !== 0) {
      // Has a sibling!
      const fromSibTile = this.tiles[from.y + sibDelta.y][from.x + sibDelta.x];
      const toSibTile = this.tiles[to.y + sibDelta.y][to.x + sibDelta.x];

      const destClear = toTile.isEmpty || toTile === fromSibTile;
      const destSibClear = toSibTile.isEmpty || toSibTile === fromTile;
      if (verbose) {
        if (destClear && destSibClear) {
          //console.log(`isMoveValid: YES 2`, from, to);
        } else if (!destClear) {
          this._audit(`isMoveValid: NO 2 (destination occupied), from:${JSON.stringify(from)}, to:${JSON.stringify(to)}`);
        } else {
          this._audit(`isMoveValid: NO 2 (sibling destination occupied), from:${JSON.stringify(from)}, to:${JSON.stringify(to)}`);
        }
      }
      return destClear && destSibClear;
    } else {
      // Single tile
      const destClear = toTile.isEmpty;
      if (verbose) {
        if (!destClear) {
          this._audit(`isMoveValid: NO 1 (destination occupied), from:${JSON.stringify(from)}, to:${JSON.stringify(to)}`);
        } else {
          //console.log('isMoveValid: YES 1', from, to);
        }
      }
      return destClear;
    }
  }

  _isMoveValid(move: Move): boolean {
    if (move.to.x === move.from.x && move.to.y === move.from.y) {
      if (verbose) {
        this._audit(`isMoveValid: NO (same square)`);
      }
      return false;
    }

    if (move.type === 'tile') {
      return this._isTileMoveValid(move.from, move.to);
    } else if (move.type === 'ball') {
      const fromTile = this.tiles[move.from.y][move.from.x];
      const toTile = this.tiles[move.to.y][move.to.x];
      if (verbose) {
        if (fromTile.ballColor === undefined) {
          this._audit(`isMoveValid: NO B (no ball) ${JSON.stringify(move)}`);
        } else if (toTile.ballColor) {
          this._audit(`isMoveValid: NO B (occupied by ball) ${JSON.stringify(move)}`);
        }
      }
      return (fromTile.ballColor !== undefined && !toTile.ballColor);
    } else {
      this._audit(`IsMoveValid: Unreachable code!`);
      return false;
    }
  }

  _audit(msg: string) {
    console.log(msg);
  }

}
