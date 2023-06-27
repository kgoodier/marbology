import * as AsciiBoard from './AsciiBoard.js'
import type { TileState, Move, SolverStats } from './types';
import BoardSolver from './BoardSolver';
import { assert } from 'console';

type BoardRecord = {
  board: BoardSolver,
  boardNum: number,
  fromBoardNum: number,
  depth: number,
};

const verbose = false;

export default class MarbologySolver {
  statesToSearch: Array<BoardRecord>;
  seenBoards: Map<string /*hash*/, number /*boardNum*/>;
  states: Map<number, BoardRecord>;
  boardCount: number;
  winningBoard?: BoardRecord;
  stats: SolverStats;

  constructor(tiles: TileState[][]) {
    this.statesToSearch = [];
    this.seenBoards = new Map();
    this.states = new Map();
    this.boardCount = 0;
    this.winningBoard = undefined;
    this.stats = {
      status: 'NotStarted',
      iterations: 0,
      loops: 0,
      branches: 0,
      depth: 0,
      unexplored: 0,
    };

    // Load initial board
    const initialBoard = new BoardSolver(tiles, undefined);
    this._pushNewState(initialBoard, 0, -1);
  }

  step(): boolean {
    this.stats.status = 'Running';

    const state = this.statesToSearch.shift();
    if (!state) {
      this.stats.status = 'Error';
      this.stats.message = `No more states to search!`;
      return false; // can never happen, TODO: better way to handle this?
    }

    /*
    console.log(`===== ITER ${iter}, BOARD_NUM ${state.boardNum}, DEPTH ${this.statesToSearch.length} =====`);
    if (verbose || iter === 0) {
      console.log(state);
      console.log(AsciiBoard.render(state.board.tiles));
    }
    */

    if (state.board.isDone()) {
      this.winningBoard = state;
      console.log('\n===== DONE =====');
      console.log(state);
      //console.log(AsciiBoard.render(state.board.tiles));
      console.log('Winning board!');
      this.stats.status = 'Done';
      return false;
    }

    const newMoves: Array<Move> = state.board.generateMoves();
    newMoves.forEach(newMove => {
      const newBoards: Array<BoardSolver> = state.board.applyMove(newMove);

      // Go through all newly generated boards, add to list if not seen before.
      let c1 = this.boardCount;
      newBoards.forEach(newBoard => {
        if (this._pushNewState(newBoard, state.depth + 1, state.boardNum)) {
          this.stats.branches++;
        } else {
          this.stats.loops++;
        }
      });

      if (verbose) {
        console.log(`  Move`, newMove, `generated ${this.boardCount - c1} new board states.`);
      }

      this.stats.iterations++;
    });

    this.stats.depth = state.depth;
    return true;
  }

  getStats(): SolverStats {
    this.stats.unexplored = this.statesToSearch.length;
    return { ...this.stats };
  }

  async printSolutionPath(): Promise<void> {
    const pathToParent = this._getSolutionPath();

    const write = (str: string) => { process.stdout.write(str); }
    const cls = () => { write('\x1B[2J\r'); } // clear screen, set to 0,0
    //const eol = () => { write('\x1B[K\r'); } // erase to end-of-line
    const pos = (col: number, line: number) => { write(`\x1B[${line};${col}H\r`); } // set pos line;col

    cls();
    pos(0, 0);
    write(`===== ORIGINAL BOARD =====\n`);
    //write(AsciiBoard.render(pathToParent[pathToParent.length - 1].board.tiles));
    write('\n');

    cls();
    pos(0, 0);
    write(`===== WINNING BOARD =====\n`);
    //write(AsciiBoard.render(pathToParent[0].board.tiles));
    write('\n');

    cls();
    pos(0, 0);
    write(`===== STATS =====\n`);
    write(`Explored moves: ${this.boardCount}\n`);
    write(`Solution moves: ${pathToParent.length}\n`)
    write(`Solution: `);
    for (let i = 0; i < 5; i++) {
      write('.');
    }
    cls();

    for (let i = pathToParent.length - 1; i >= 0; i--) {
      const record = pathToParent[i];
      pos(0, 0);
      write(`===== #${record.boardNum}, parent #${record.fromBoardNum}, depth ${record.depth} =====\x1B[K\n`);
      //write(AsciiBoard.render(record.board.tiles));
      write('\n');
      //await sleep(500);
      await new Promise(r => setTimeout(r, 500));
    }

    return Promise.resolve();
  }


  _getSolutionPath(): Array<BoardRecord> {
    if (!this.winningBoard) {
      console.log(`No winning board, please solve it first.`);
      return [];
    }

    const pathToParent: Array<BoardRecord> = [];
    let record: BoardRecord | undefined = this.winningBoard;
    while (record && record.fromBoardNum !== record.boardNum) {
      pathToParent.push(record);
      record = this.states.get(record.fromBoardNum);
    }
    if (record) {
      pathToParent.push(record);  // push initial board
    }

    return pathToParent.reverse();
  }

  _pushNewState(board: BoardSolver, depth: number, fromBoardNum: number): BoardRecord | null {
    const hash = board.hash();
    const boardNum = this.seenBoards.get(hash);
    if (!boardNum) {
      const record: BoardRecord = {
        board,
        boardNum: this.boardCount++,
        fromBoardNum,
        depth
      };
      this.states.set(record.boardNum, record);
      this.statesToSearch.push(record);
      this.seenBoards.set(hash, record.boardNum);
      if (verbose) {
        const boardNumStr = ("0000" + record.boardNum.toString()).substr(-4);
        console.log(`[B${boardNumStr}] New board: YES from:${record.fromBoardNum} num:${record.boardNum} hash:${hash}`);
      }
      return record;
    } else {
      if (verbose) {
        const boardNumStr = ("0000" + boardNum.toString()).substr(-4);
        console.log(`[B${boardNumStr}] New board: NO from:${fromBoardNum} hash:${hash}`);
      }
      return null;
    }
  }

}

