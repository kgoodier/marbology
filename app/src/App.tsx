import React, { ReactElement, useMemo} from 'react';

import { TileState } from './utils/types';
import { defaultBoard, parse } from './utils/AsciiBoard';
import Board from './Board';
import Tile from './Tile';

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
          <Tile tile={tiles[y][x]} />
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
      </Board>
    </div>
  );
}

export default App;
