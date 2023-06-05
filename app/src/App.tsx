import React, { ReactElement, useMemo} from 'react';

import { TileState } from './utils/types';
import { defaultBoard, parse } from './utils/AsciiBoard';
import Board from './Board';
import Tile from './Tile';

import './App.css';
import TileDecoration from './TileDecoration';

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
    </div>
  );
}

export default App;
