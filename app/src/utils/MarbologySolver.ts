import * as AsciiBoard from './AsciiBoard.js'
import type { TileState, Move, SolutionState, SolverStats, Solutions } from './types';
import BoardConfiguration from './BoardConfiguration';
import { assert } from 'console';

const verbose = false;

export default class MarbologySolver {
  statesToSearch: Array<SolutionState>;
  states: Map<string /*name*/, SolutionState>;
  statesSeen: Map<string /*hash*/, SolutionState>;
  boardCount: number;
  initialState: SolutionState;
  winningState?: SolutionState;
  stats: SolverStats;

  constructor(tiles: TileState[][]) {
    this.statesToSearch = [];
    this.statesSeen = new Map();
    this.states = new Map();
    this.boardCount = 0;
    this.winningState = undefined;
    this.stats = {
      status: 'NotStarted',
      iterations: 0,
      loops: 0,
      branches: 0,
      depth: 0,
      unexplored: 0,
    };

    // Load initial board
    this._pushNewState(new BoardConfiguration(tiles, undefined));
    this.initialState = this.statesToSearch[0];
  }

  step(): boolean {
    this.stats.status = 'Running';

    const state = this.statesToSearch.shift();
    if (!state) {
      this.stats.status = 'Error';
      this.stats.message = `No more states to search!`;
      return false; // can never happen, TODO: better way to handle this?
    }

    if (this._checkIsDone(state.board)) {
      return false;
    }

    let isDone = false;
    const newMoves: Array<Move> = state.board.generateMoves();
    newMoves.forEach(newMove => {
      const newBoards: Array<BoardConfiguration> = state.board.applyMove(newMove);

      // Go through all newly generated boards, add to list if not seen before.
      let c1 = this.boardCount;
      newBoards.forEach(newBoard => {
        if (this._pushNewState(newBoard, state)) {
          this.stats.branches++;
          if (this._checkIsDone(newBoard)) {
            isDone = true;
          }
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
    return !isDone;
  }

  _checkIsDone(board: BoardConfiguration): boolean {
    if (board.isDone()) {
      this.winningState = this.states.get(board.hash());
      this.stats.status = 'Done';
      console.log('\n===== DONE =====');
      console.log(this.winningState);
      return true;
    }
    return false;
  }

  getBoard(name: string): SolutionState | undefined {
    return this.states.get(name);
  }

  getStats(): SolverStats {
    this.stats.unexplored = this.statesToSearch.length;
    return { ...this.stats };
  }

  getSolutions(): Solutions {
    function remap(record: SolutionState): Solutions {
      return {
        name: record.name,
        children: record.children.map(remap),
      };
    }
    return remap(this.initialState);
  }

  getSolutionPath(): Array<SolutionState> {
    if (!this.winningState) {
      console.log(`No winning board, please solve it first.`);
      return [];
    }

    const pathToParent: Array<SolutionState> = [];
    let record: SolutionState | undefined = this.winningState;
    while (record?.parent) {
      pathToParent.push(record);
      record = this.states.get(record.parent.name);
    }
    if (record) {
      pathToParent.push(record);  // push initial board
    }

    return pathToParent.reverse();
  }

  _pushNewState(board: BoardConfiguration, parentBoard?: SolutionState, move?: Move): SolutionState | null {
    const hash = board.hash();
    const oldRecord = this.statesSeen.get(hash);

    // Don't explore further if we've already seen this board state.
    if (oldRecord) {
      if (verbose) {
        const boardNumStr = ("0000" + oldRecord.name.toString()).substr(-4);
        console.log(`[B${boardNumStr}] New board: NO from:${parentBoard?.name} hash:${hash}`);
      }
      return null;
    }

    const boardNum = this.boardCount++;
    const record: SolutionState = {
      name: `${boardNum}`,
      board: board,
      parent: parentBoard,
      depth: parentBoard ? (parentBoard.depth + 1) : 0,
      children: [],
      move: move,
    };
    this.states.set(record.name, record);
    this.statesToSearch.push(record);
    this.statesSeen.set(hash, record);
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

