import React, { PropsWithChildren, useEffect, useState} from 'react';

import Marbology from './utils/MarbologySolver';
import { SolverStats } from './utils/types';

export default function SolverUI({solver}: {solver: Marbology}) {
  const [stats, setStats] = useState<SolverStats>({
    status: 'NotStarted',
    iterations: 0,
    loops: 0,
    branches: 0,
    depth: 0,
  });

  useEffect(() => {
    while (solver.step()) {
      let stats = solver.getStats();
      setStats(stats);

      // Safety net
      if (stats.depth >= 10) {
        return;
      }
    }
  }, [solver]);

  return (
    <div>
      Status: {stats.status}<br />
      {stats.message ? `Message: ${stats.message}<br/>` : null}
      Iterations: {stats.iterations}<br />
      Loops: {stats.loops}<br />
      Depth: {stats.depth}<br />
    </div>
  );
}
