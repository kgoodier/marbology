import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import { TileState } from './utils/types';
import { defaultBoards, defaultBoard, parse, renderDebug } from './utils/AsciiBoard';

import Board from './Board';
import MarbologySolver from './utils/MarbologySolver';
import SolverUI from './SolverUI';
import Tile from './Tile';
import TileDecoration from './TileDecoration';

import './App.css';

function App() {
  const [tiles, setTiles] = useState<Array<Array<TileState>>>(parse(defaultBoard));
  const [solver, setSolver] = useState<MarbologySolver>(new MarbologySolver(tiles));

  const handleSelectBoard = useCallback((name: string) => {
    const board = solver.getBoard(name);
    if (board) {
      setTiles(board.board.tiles);
    }
  }, [solver]);

  const handleBoardChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const i = parseInt(event.target.value);
    const [name, board] = defaultBoards[i];
    const parsedBoard = parse(board);
    setSolver(new MarbologySolver(parsedBoard));
    setTiles(parsedBoard);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Marbology
        </p>
      </header>

      <div className="App-body">
        <div className="App-container">
          <Board>
            <Tiles tiles={tiles} />
            <TileDecorations tiles={tiles} />
          </Board>
          <div>
            <select onChange={handleBoardChange}>
              {defaultBoards.map((board, index) => (
                <option key={board[0]} value={index}>{board[0]}</option>
              ))}
            </select>
          </div>
        </div>
        <SolverUI solver={solver} onSelectBoard={handleSelectBoard} />
      </div>

    </div>
  );
}

function Tiles({ tiles }: { tiles: Array<Array<TileState>> }) {
  const arr: Array<ReactElement> = [];
  for (let y = 1; y <= 4; y++) {
    for (let x = 1; x <= 6; x++) {
      arr.push((
        <Tile x={x} y={y} tile={tiles[y][x]} key={`${x}/${y}`} />
      ));
    }
  }
  return (<>{arr}</>);
}

function TileDecorations({ tiles }: { tiles: Array<Array<TileState>> }) {
  const arr: Array<ReactElement> = [];
  for (let y = 1; y <= 4; y++) {
    for (let x = 1; x <= 6; x++) {
      arr.push((
        <TileDecoration x={x} y={y} tile={tiles[y][x]} key={`${x}/${y}`} />
      ));
    }
  }
  return (<>{arr}</>);
}

export default App;
