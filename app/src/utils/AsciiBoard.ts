import { TileState } from './types';
import assert from './assert';

export const defaultBoard041 = `
........... ........... ...........
........... ........... ...........
........... ........... ...........
                                   
..... ........... ..... ...........
..... --------+.. ..... ...........
..... ........|.. ..... ...........
                  .....            
      ..... B.|.. ..... ..... .....
      ..B-- ..Z-- ..... ..... ..Z--
      ..... ..|.. ..... ..... ..|..
                                   
      ..... ........... A.|...Z....
      ..... ........... ..Z-----A..
      ..... ........... ...........
`;

export const defaultBoard001Mid = `
..... ........... A.... ...........
..... ........... --Z-- ...........
..... ........... ..... ...........
                                   
..... ..... ........... ..... .....
..... ..... ........... ..... .....
..... ..... ........... ..... .....
.....                         .....
..... ...........       ..... .....
..... ...........       ..... .....
..... ...........       ..... .....
                        .....      
..... ...........       ..... .....
..A-- ...........       ..... .....
..... ...........       ..... .....
`;

export const defaultBoard001_num1 = `
.....       ...........       A....
.....       ...........       --Z--
.....       ...........       .....
                                   
..... ..... ........... ...........
..... ..... ........... ...........
..... ..... ........... ...........
.....                              
..... ........... ..... ..... .....
..... ........... ..... ..... .....
..... ........... ..... ..... .....
                  .....       .....
..... ........... ..... ..... .....
..A-- ........... ..... ..... .....
..... ........... ..... ..... .....
`;

export const defaultBoard = defaultBoard041;

const TILES_W = 6; // tiles
const TILES_H = 4; // tiles
const TILE_CHARS_W = 5;
const TILE_CHARS_H = 3;
/*
const BOARD_TILES_W = TILES_W + 2; // border
const BOARD_TILES_H = TILES_H + 2; // border
const BOARD_CHARS_W = (TILE_CHARS_W * TILES_W) + (TILES_W - 1);
const BOARD_CHARS_H = (TILE_CHARS_H * TILES_H) + (TILES_H - 1);
*/

const emptyTile: TileState = {
  ballColor: undefined,
  isEmpty: true,
  siblingDirection: '',
  divotColor: undefined,
  exits: [false, false, false, false]
};

const verbose = false;

export function parse(boardAscii: string): Array<Array<TileState>> {
  // TOOD: expand so each tile has a 1 char border, to match toString()
  const lines = boardAscii.trim().split('\n');

  const tilesWidth = (lines[0].length + 1) / (TILE_CHARS_W + 1);
  const tilesHeight = (lines.length + 1) / (TILE_CHARS_H + 1);
  assert(Number.isInteger(tilesWidth), `ascii board is wrong width`);
  assert(Number.isInteger(tilesHeight), `ascii board is wrong height`);
  if (verbose) {
    console.log(`parse tilesWidth:${tilesWidth}, tilesHeight:${tilesHeight}`);
  }

  const tiles: Array<Array<TileState>> = [];
  for (let y = 0; y < tilesHeight + 2; y++) {
    tiles.push([]);
    for (let x = 0; x < tilesWidth + 2; x++) {
      if (y === 0 || y === tilesHeight + 1 || x === 0 || x === tilesWidth + 1) {
        // Border tiles
        tiles[y].push(emptyTile);
      } else {
        const tile = getTile(lines, x - 1, y - 1);
        if (tile) {
          tiles[y].push(tile);
        }
      }
    }
  }

  return tiles;
}

function getTile(lines: Array<string>, x: number, y: number): TileState {
  // Sample row of tiles:
  // ..... B.|.. ..... ..... .....
  // ..B-- ..Z-- ..... ..... ..Z--
  // ..... ..|.. ..... ..... ..|..

  const i = x * TILE_CHARS_W + x;
  const j = y * TILE_CHARS_H + y;

  if (verbose) {
    console.log(`getTile(x:${x}, y:${y}) i:${i}, j:${j}`);
  }
  const hasLeftSibling = x > 0 && lines[j + 1][i - 1] !== ' ';
  const hasTopSibling = y > 0 && lines[j - 1][i + 2] !== ' ';
  const hasRightSibling = x < (TILES_W - 1) && lines[j + 1][i + 5] !== ' ';
  const hasBottomSibling = y < (TILES_H - 1) && lines[j + 3][i + 2] !== ' ';
  const ballColor = lines[j][i];
  const divotColor = lines[j + 1][i + 2];
  const exits = [ // t,r,b,l
    lines[j][i + 2] === '|',
    lines[j + 1][i + 4] === '-',
    lines[j + 2][i + 2] === '|',
    lines[j + 1][i] === '-'
  ];

  return {
    ballColor: ballColor !== '.' ? ballColor : undefined,
    isEmpty: divotColor === ' ',
    siblingDirection:
      hasTopSibling ? 'top' :
      hasRightSibling ? 'right' :
      hasBottomSibling ? 'bottom' :
      hasLeftSibling ? 'left' :
      undefined,
    divotColor: divotColor >= 'A' && divotColor <= 'Z' ? divotColor : undefined,
    exits // t,r,b,l
  };
}
