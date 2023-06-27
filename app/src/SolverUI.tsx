import React, { PropsWithChildren, useEffect, useState } from 'react';

import SolutionTree from './SolutionTree';

import MarbologySolver from './utils/MarbologySolver';
import { SolverStats } from './utils/types';
import delay from './utils/delay';

import './SolverUI.css';

export default function SolverUI({ solver }: { solver: MarbologySolver }) {
  const [status, setStatus] = useState('NotStarted');
  const [message, setMessage] = useState<string | undefined>('');
  const [iterations, setIterations] = useState(0);
  const [loops, setLoops] = useState(0);
  const [branches, setBranches] = useState(0);
  const [depth, setDepth] = useState(0);
  const [unexplored, setUnexplored] = useState(0);


  useEffect(() => {
    function gatherStats(stats: SolverStats) {
      setStatus(stats.status);
      setMessage(stats.message);
      setIterations(stats.iterations);
      setLoops(stats.loops);
      setBranches(stats.branches);
      setDepth(stats.depth);
      setUnexplored(stats.unexplored);
    }

    async function go() {
      while (solver.step()) {
        let stats = solver.getStats();
        gatherStats(stats);
        await delay(10);
        // Safety net
        if (stats.depth >= 4) {
          return;
        }
      }
      gatherStats(solver.getStats());
    }

    go();
  }, [solver]);

  return (
    <div className='solver-ui'>
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
        <SolutionTree />
      </div>
    </div>
  );
}
