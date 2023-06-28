import * as AsciiBoard from './AsciiBoard.js'
import type { TileState, Move, BoardRecord, SolverStats, Solutions } from './types';
import BoardSolver from './BoardSolver';
import { assert } from 'console';

const verbose = false;

export default class MarbologySolver {
  statesToSearch: Array<BoardRecord>;
  states: Map<string /*name*/, BoardRecord>;
  seenBoards: Map<string /*hash*/, BoardRecord>;
  boardCount: number;
  initialBoard: BoardRecord;
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
    const initialSolver = new BoardSolver(tiles, undefined);
    this._pushNewState(initialSolver, undefined);
    this.initialBoard = this.statesToSearch[0];
  }

  step(): boolean {
    this.stats.status = 'Running';

    const state = this.statesToSearch.shift();
    if (!state) {
      this.stats.status = 'Error';
      this.stats.message = `No more states to search!`;
      return false; // can never happen, TODO: better way to handle this?
    }

    if (state.solver.isDone()) {
      this.winningBoard = state;
      console.log('\n===== DONE =====');
      console.log(state);
      //console.log(AsciiBoard.render(state.board.tiles));
      console.log('Winning board!');
      this.stats.status = 'Done';
      return false;
    }

    const newMoves: Array<Move> = state.solver.generateMoves();
    newMoves.forEach(newMove => {
      const newBoards: Array<BoardSolver> = state.solver.applyMove(newMove);

      // Go through all newly generated boards, add to list if not seen before.
      let c1 = this.boardCount;
      newBoards.forEach(newBoard => {
        if (this._pushNewState(newBoard, state)) {
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

  getBoard(name: string): BoardRecord | undefined {
    return this.states.get(name);
  }

  getStats(): SolverStats {
    this.stats.unexplored = this.statesToSearch.length;
    return { ...this.stats };
  }

  getSolutions(): Solutions {
    function remap(record: BoardRecord): Solutions {
      return {
        name: record.name,
        children: record.children.map(remap),
      };
    }
    return remap(this.initialBoard);
  }

  getSolutionPath(): Array<BoardRecord> {
    if (!this.winningBoard) {
      console.log(`No winning board, please solve it first.`);
      return [];
    }

    const pathToParent: Array<BoardRecord> = [];
    let record: BoardRecord | undefined = this.winningBoard;
    while (record?.parent) {
      pathToParent.push(record);
      record = this.states.get(record.parent.name);
    }
    if (record) {
      pathToParent.push(record);  // push initial board
    }

    return pathToParent.reverse();
  }

  async printSolutionPath(): Promise<void> {
    const pathToParent = this.getSolutionPath();

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
      write(`===== #${record.name}, parent #${record.parent?.name}, depth ${record.depth} =====\x1B[K\n`);
      //write(AsciiBoard.render(record.board.tiles));
      write('\n');
      //await sleep(500);
      await new Promise(r => setTimeout(r, 500));
    }

    return Promise.resolve();
  }



  _pushNewState(board: BoardSolver, parentBoard: BoardRecord | undefined): BoardRecord | null {
    const hash = board.hash();
    const oldRecord = this.seenBoards.get(hash);

    // Don't explore further if we've already seen this board state.
    if (oldRecord) {
      if (verbose) {
        const boardNumStr = ("0000" + oldRecord.name.toString()).substr(-4);
        console.log(`[B${boardNumStr}] New board: NO from:${parentBoard?.name} hash:${hash}`);
      }
      return null;
    }

    const boardNum = this.boardCount++;
    const record: BoardRecord = {
      name: `${boardNum}`,
      solver: board,
      parent: parentBoard,
      depth: parentBoard ? (parentBoard.depth + 1) : 0,
      children: []
    };
    this.states.set(record.name, record);
    this.statesToSearch.push(record);
    this.seenBoards.set(hash, record);
    if (parentBoard) {
      parentBoard.children.push(record);
    }

    if (verbose) {
      const boardNumStr = ("0000" + record.name).substr(-4);
      console.log(`[B${boardNumStr}] New board: YES from:${parentBoard?.name} num:${record.name} hash:${hash}`);
    }
    return record;
  }

}

