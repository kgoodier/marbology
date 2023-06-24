import React, { ReactElement, useEffect, useMemo, useState} from 'react';

import { TileState } from './utils/types';
import { defaultBoard, parse } from './utils/AsciiBoard';

import Board from './Board';
import Marbology from './utils/MarbologySolver';
import SolverUI from './SolverUI';
import Tile from './Tile';
import TileDecoration from './TileDecoration';

import './App.css';

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

  const solver: Marbology = useMemo(() => new Marbology(tiles), [tiles]);

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
        <SolverUI solver={solver} />
      </footer>
    </div>
  );
}

export default App;
