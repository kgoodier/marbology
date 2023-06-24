import type { TileState } from './types';

export default function hashTile(tile: TileState): string {
  if (tile.isEmpty) {
    return '????';
  }
  const bc = tile.ballColor || '.';
  const dc = tile.divotColor || '.';
  const sd = tile.siblingDirection && tile.siblingDirection.length > 0 ? tile.siblingDirection.charAt(0) : '.';
  const accum = tile.exits.reduce(((accum, val) => (accum << 1) | (val ? 1 : 0)), 0);
  const ex = String.fromCharCode('a'.charCodeAt(0) + accum);
  return bc + dc + sd + ex;
}
