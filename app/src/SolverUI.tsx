import React, { PropsWithChildren, useEffect, useState } from 'react';

import SolutionTree from './SolutionTree';

import MarbologySolver from './utils/MarbologySolver';
import { SolutionState, SolverStats, Solutions } from './utils/types';
import delay from './utils/delay';

import './SolverUI.css';

export default function SolverUI({ solver, onSelectBoard }: { solver: MarbologySolver, onSelectBoard?: (name: string) => void }) {
  const [status, setStatus] = useState('NotStarted');
  const [message, setMessage] = useState<string | undefined>('');
  const [iterations, setIterations] = useState(0);
  const [loops, setLoops] = useState(0);
  const [branches, setBranches] = useState(0);
  const [depth, setDepth] = useState(0);
  const [unexplored, setUnexplored] = useState(0);
  const [solutions, setSolutions] = useState<Solutions>(solver.getSolutions());

  console.log('!!! render SolverUI');

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
      setSolutions(solver.getSolutions());
      await delay(10);
      // Safety net
      if (stats.depth >= 6) {
        return;
      }
    }
    console.log(`Actually done? Winning path: ${JSON.stringify(solver.getSolutionPath(), null, 2)}`);
    console.log(`${JSON.stringify(solver.getStats())}`);
    gatherStats(solver.getStats());
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
      <div>
        <SolutionTree solutions={solutions} onSelect={onSelectBoard} />
      </div>
    </div>
  );
}
