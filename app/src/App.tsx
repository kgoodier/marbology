import React, { ReactElement, useCallback, useState } from 'react';

import { TileState } from './utils/types';
import * as AsciiBoard from './utils/AsciiBoard';

import Board from './Board';
import MarbologySolver from './utils/MarbologySolver';
import SolverUI from './SolverUI';
import Tile from './Tile';

import './App.css';

function App() {
  const [tiles, setTiles] = useState<Array<Array<TileState>>>(AsciiBoard.parse(AsciiBoard.defaultBoard));
  const [solver, setSolver] = useState<MarbologySolver>(new MarbologySolver(tiles));

  const handleViewBoard = useCallback((name: string) => {
    const board = solver.getBoard(name);
    if (board) {
      setTiles(board.board.tiles);
    }
  }, [solver]);

  const handleBoardChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const i = parseInt(event.target.value);
    const [name, board] = AsciiBoard.defaultBoards[i];
    const parsedBoard = AsciiBoard.parse(board);
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
          </Board>
          <div>
            <select defaultValue={AsciiBoard.defaultBoardIndex} onChange={handleBoardChange}>
              {AsciiBoard.defaultBoards.map((board, index) => (
                <option key={board[0]} value={index}>{board[0]}</option>
              ))}
            </select>
          </div>
        </div>
        <SolverUI solver={solver} onViewBoard={handleViewBoard} />
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

export default App;
