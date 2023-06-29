import React, { memo, useState } from 'react';

import SolutionTree from './SolutionTree';

import MarbologySolver from './utils/MarbologySolver';
import { SolutionState, SolverStats, Solutions } from './utils/types';
import { renderDebug } from './utils/AsciiBoard';
import delay from './utils/delay';

import './SolverUI.css';

const SolverUI = memo(function SolverUI({ solver, onSelectBoard }: { solver: MarbologySolver, onSelectBoard?: (name: string) => void }) {
  const [status, setStatus] = useState('NotStarted');
  const [message, setMessage] = useState<string | undefined>('');
  const [iterations, setIterations] = useState(0);
  const [loops, setLoops] = useState(0);
  const [branches, setBranches] = useState(0);
  const [depth, setDepth] = useState(0);
  const [unexplored, setUnexplored] = useState(0);
  const [solutions, setSolutions] = useState<Solutions>(solver.getSolutions());

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
    const isMore = solver.step();
    gatherStats(solver.getStats());
    setSolutions(solver.getSolutions());
  }

  async function run() {
    while (solver.step()) {
      let stats = solver.getStats();
      gatherStats(stats);
      //setSolutions(solver.getSolutions());
      //await delay(10);
      // Safety net
      if (stats.depth > 20) {
        setSolutions(solver.getSolutions());
        return;
      }
    }
    console.log(`Winning path:`, solver.getSolutionPath());
    console.log(`${JSON.stringify(solver.getStats())}`);
    gatherStats(solver.getStats());
    setSolutions(solver.getSolutions());
  }

  function handleDebugBoard(name: string) {
    if (solver) {
      const state = solver.getBoard(name);
      if (state) {
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
        <SolutionTree solutions={solutions} onSelect={onSelectBoard} onDebug={handleDebugBoard} />
      </div>
    </div>
  );
});

export default SolverUI;
