import React, { ReactElement, useEffect, useMemo, useState} from 'react';

import { SolverStats, TileState } from './utils/types';
import { defaultBoard, parse } from './utils/AsciiBoard';
import Board from './Board';
import Tile from './Tile';

import './App.css';
import TileDecoration from './TileDecoration';
import Marbology from './utils/MarbologySolver';

function App() {
  const tiles: Array<Array<TileState>> = useMemo(() => {
    return parse(defaultBoard);
  }, []);

  const renderTiles: Array<ReactElement> = useMemo(() => {
    const arr: Array<ReactElement> = [];
    for (let y = 1; y <= 4; y++) {
      for (let x = 1; x <= 6; x++) {
        arr.push((
          <Tile x={x} y={y} tile={tiles[y][x]} key={`${x}/${y}`} />
        ));
      }
    }
    return arr;
  }, [tiles]);

  const renderDecorations: Array<ReactElement> = useMemo(() => {
    const arr: Array<ReactElement> = [];
    for (let y = 1; y <= 4; y++) {
      for (let x = 1; x <= 6; x++) {
        arr.push((
          <TileDecoration x={x} y={y} tile={tiles[y][x]} key={`${x}/${y}`} />
        ));
      }
    }
    return arr;
  }, [tiles]);


  const [stats, setStats] = useState<SolverStats>({
    status: 'NotStarted',
    iterations: 0,
    loops: 0,
    branches: 0,
    depth: 0,
  });

  useEffect(() => {
    const solver = new Marbology(tiles);
    do {
      var stats = solver.step();
      setStats(stats);

      // Safety net
      if (stats.iterations >= 100) {
        return;
      }
    } while (stats && stats.status === 'Running');

    //setStats(solver.getStats);
  }, [tiles]);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Marbology
        </p>
      </header>

      <Board>
        {renderTiles}
        {renderDecorations}
      </Board>

      <footer className="App-footer">
        <p>
          Status: {stats.status}<br/>
          {stats.message ? `Message: ${stats.message}<br/>` : null}
          Iterations: {stats.iterations}<br/>
        </p>
      </footer>
    </div>
  );
}

export default App;
