import * as AsciiBoard from './AsciiBoard.js'
import type { TileState, Move, SolutionState, SolverStats, Solutions } from './types';
import BoardConfiguration from './BoardConfiguration';
import { assert } from 'console';

const verbose = false;

export default class MarbologySolver {
  statesToSearch: Array<SolutionState> = [];
  states: Map<string /*name*/, SolutionState> = new Map();
  statesSeen: Map<string /*hash*/, SolutionState> = new Map();
  boardCount: number = 0;
  initialState: SolutionState;
  winningState?: SolutionState = undefined;
  winningSolution: Array<SolutionState> = [];
  stats: SolverStats = {
    status: 'NotStarted',
    iterations: 0,
    loops: 0,
    branches: 0,
    depth: 0,
    unexplored: 0,
  };

  constructor(tiles: TileState[][]) {
    // Load initial board
    this._pushNewState(new BoardConfiguration(tiles, undefined));
    this.initialState = this.statesToSearch[0];
  }

  step(): boolean {
    if (this.stats.status === 'Done') {
      return false;
    }

    this.stats.status = 'Running';
    const state = this.statesToSearch.shift();
    if (!state) {
      this.stats.status = 'Error';
      this.stats.message = `No more states to search!`;
      return false; // can never happen, TODO: better way to handle this?
    }

    if (this._checkIsDone(state)) {
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
          if (this._checkIsDone(state)) {
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

  _checkIsDone(state: SolutionState): boolean {
    if (state.board.isDone()) {
      this.stats.status = 'Done';
      this.winningState = state;
      this.winningSolution = this.getSolutionPath(state);
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
    if (this.winningSolution.length > 0) {
      // We have a solution, so return a single path.
      function arrayToTree(array: Array<SolutionState>): Solutions {
        const root: Solutions = {
          name: 'root',
          children: [],
        };
        let current = root;
        array.forEach(state => {
          current.children.push({
            name: state.name,
            children: []
          });
          current = current.children[0];
        });
        return root.children[0];
      }
      return arrayToTree(this.winningSolution);
    } else {
      // We don't have a solution, so return the whole tree.
      const statesToSearchSet = new Set(this.statesToSearch);
      function remap(record: SolutionState): Solutions {
        const node: Solutions = {
          name: record.name,
          children: record.children.map(remap),
        };
        if (statesToSearchSet.has(record)) {
          node.itemStyle = { color: 'lightgreen' };
          node.tooltip = { formatter: 'to be explored' };
        }
        return node;
      }
      return remap(this.initialState);
    }
  }

  getSolutionPath(endState: SolutionState | undefined = this.winningState): Array<SolutionState> {
    const pathToParent: Array<SolutionState> = [];
    let state = endState;
    while (state) {
      pathToParent.push(state);
      state = state.parent;
    }
    return pathToParent.reverse();
  }

  _pushNewState(board: BoardConfiguration, parentBoard?: SolutionState, move?: Move): SolutionState | null {
    const hash = board.hash();
    const priorState = this.statesSeen.get(hash);

    // Don't explore further if we've already seen this board state.
    if (priorState) {
      if (verbose) {
        const boardNumStr = ("0000" + priorState.name.toString()).substr(-4);
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

