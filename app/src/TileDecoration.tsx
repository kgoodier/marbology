import React, { PropsWithChildren } from 'react';
import { TileState } from './utils/types';

//import './TileDecoration.css'

// x and y are 1-based, to match CSS grid.
export default function TileDecoration({ x, y, tile }: PropsWithChildren<{ x: number, y: number, tile: TileState }>) {
  if (tile.isEmpty) {
    return null;
  }

  function Ring() {
    if (tile.divotColor && tile.divotColor !== 'Z') {
      return (
        <div className={`ring ${tile.divotColor}`} />
      );
    } else {
      return null;
    }
  }

  function Ball() {
    if (tile.ballColor && tile.ballColor !== 'Z') {
      return (
        <div className={`ball ${tile.ballColor}`} />
      );
    } else {
      return null;
    }
  }

  function Divot() {
    return tile.divotColor ? (<div className="divot" />) : null;
  }

  function Paths() {
    if (tile.divotColor) {
      // 1x1 or 1x2 tile with a divot
      return (
        <>
          {tile.exits[0] ? (<div className="path u" />) : undefined}
          {tile.exits[1] ? (<div className="path r" />) : undefined}
          {tile.exits[2] ? (<div className="path d" />) : undefined}
          {tile.exits[3] ? (<div className="path l" />) : undefined}
        </>
      );
    } else if (!tile.siblingDirection) {
      // 1x1 tile without a divot
      return (
        <>
          {tile.exits[0] ? (<div className="path u" />) : undefined}
          {tile.exits[1] ? (<div className="path r" />) : undefined}
          {tile.exits[2] ? (<div className="path d" />) : undefined}
          {tile.exits[3] ? (<div className="path l" />) : undefined}
        </>
      );
    } else {
      // 1x2 tile without a divot
      return (
        <>
          {tile.exits[0] ? (<div className="path u" />) : undefined}
          {tile.exits[1] ? (<div className="path r" />) : undefined}
          {tile.exits[2] ? (<div className="path d" />) : undefined}
          {tile.exits[3] ? (<div className="path l" />) : undefined}
        </>
      );
    }

  }

  let style = {
    gridColumnStart: x,
    gridRowStart: y,
    //aspectRatio: `1 / 1`
    aspectRatio: tile.siblingDirection === 'bottom' ? '2 / 1' : '1 / 1', // TODO: works but feels fragile 
  };

  let className = 'tile_decoration';
  if (tile.siblingDirection === 'bottom') {
    className += ' vertical';
  }

  return (
    <div className={className} style={style}>
      <Ring />
      <Divot />
      <Paths />
      <Ball />
    </div>
  );
}
