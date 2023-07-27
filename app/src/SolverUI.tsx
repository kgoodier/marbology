import React, { memo, useEffect, useState } from 'react';

import SolutionList from './SolutionList';
import SolutionTree from './SolutionTree';

import MarbologySolver from './utils/MarbologySolver';
import { SolverStats, SolutionState } from './utils/types';
import { renderDebug } from './utils/AsciiBoard';

import './SolverUI.css';

const SolverUI = memo(function SolverUI({ solver, onViewBoard }: { solver: MarbologySolver, onViewBoard?: (name: string) => void }) {
  const [status, setStatus] = useState('NotStarted');
  const [message, setMessage] = useState<string | undefined>('');
  const [iterations, setIterations] = useState(0);
  const [loops, setLoops] = useState(0);
  const [branches, setBranches] = useState(0);
  const [depth, setDepth] = useState(0);
  const [unexplored, setUnexplored] = useState(0);
  const [winningSolutionPath, setWinningSolutionPath] = useState<SolutionState[]>(solver.getSolutionPathToWinningState());

  useEffect(() => {
    setWinningSolutionPath(solver.getSolutionPathToWinningState());
    setDepth(solver.getStats().depth);
  }, [solver]);

  function gatherStats(stats: SolverStats) {
    setStatus(stats.status);
    setMessage(stats.message);
    setIterations(stats.iterations);
    setLoops(stats.loops);
    setBranches(stats.branches);
    setDepth(stats.depth);
    setUnexplored(stats.unexplored);
  }

  function step() {
    // Step 1 level deeper
    const currentDepth = depth;
    let keepGoing = true;
    while (keepGoing) {
      keepGoing = solver.step();
      const stats = solver.getStats();
      gatherStats(stats);
      if (stats.depth > currentDepth) {
        break;
      }
    }
    setWinningSolutionPath(solver.getSolutionPathToWinningState());
  }

  async function run() {
    while (solver.step()) {
      let stats = solver.getStats();
      gatherStats(stats);
      // TODO: (remove) Safety net "just in case" it runs too long
      if (stats.depth > 100) {
        setWinningSolutionPath(solver.getSolutionPathToWinningState());
        return;
      }
    }
    gatherStats(solver.getStats());
    setWinningSolutionPath(solver.getSolutionPathToWinningState());
  }

  function handleDebugBoard(name: string) {
    if (solver) {
      const state = solver.getBoard(name);
      if (state) {
        console.log(`Board ${name}:`);
        console.log(renderDebug(state.board.tiles));
      }
    }
  }

  return (
    <div className='solver-container'>
      <div>
        <button onClick={step}>Step</button>
        <button onClick={run}>Run</button>
      </div>
      <div className='solver-stats'>
        <div>Status</div>
        <div className='stats-value'>{status}</div>

        <div>Message</div>
        <div className='stats-value'>{message}</div>

        <div>Iterations</div>
        <div className='stats-value'>{iterations}</div>

        <div>Depth</div>
        <div className='stats-value'>{depth}</div>

        <div>Loops</div>
        <div className='stats-value'>{loops}</div>

        <div>Branches</div>
        <div className='stats-value'>{branches}</div>

        <div>Unexplored</div>
        <div className='stats-value'>{unexplored}</div>
      </div>
      <div className='solver-tree'>
        {winningSolutionPath.length > 0 ?
          <SolutionList solutionsPath={winningSolutionPath} onViewBoard={onViewBoard} onSelectBoard={handleDebugBoard} /> :
          <SolutionTree solutions={solver.getAllSolutions()} onViewBoard={onViewBoard} onSelectBoard={handleDebugBoard} />
        }
      </div>
    </div>
  );
});

export default SolverUI;
