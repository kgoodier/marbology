import React, { PropsWithChildren } from 'react';
import { TileState } from './utils/types';

import './Tile.css'

// x and y are 1-based, to match CSS grid.
export default function Tile({ x, y, tile }: PropsWithChildren<{ x: number, y: number, tile: TileState }>) {
  if (tile.isEmpty || tile.siblingDirection === "left" || tile.siblingDirection === "top") {
    return null;
  }

  let style = {
    gridColumnStart: x,
    gridRowStart: y,
    gridColumnEnd: `span ${tile.siblingDirection === 'right' ? 2 : 1}`,
    gridRowEnd: `span ${tile.siblingDirection === 'bottom' ? 2 : 1}`,
    //aspectRatio: `2 / ${tile.siblingDirection === 'right' ? 1 : tile.siblingDirection === 'bottom' ? 4 : 2}`
    aspectRatio: `2 / ${tile.siblingDirection === 'right' || tile.siblingDirection === 'bottom' ? 1 : 2}`
  };

  let className = 'tile';
  if (tile.siblingDirection === 'bottom') {
    className += ' vertical';
  }

  return (
    <div className={className} style={style}>
      <div className="tile-border" />
      <Ring divotColor={tile.divotColor} />
      <Divot divotColor={tile.divotColor} />
    </div>
  );
  //<Paths tile={tile} />
  //<Ball ballColor={tile.ballColor} />
}

function Ring({ divotColor }: { divotColor?: string }) {
  if (divotColor && divotColor !== 'Z') {
    return (
      <div className={`ring ${divotColor}`} />
    );
  } else {
    return null;
  }
}

function Ball({ ballColor }: { ballColor?: string }) {
  if (ballColor && ballColor !== 'Z') {
    return (
      <div className={`ball ${ballColor}`} />
    );
  } else {
    return null;
  }
}

function Divot({ divotColor }: { divotColor?: string }) {
  return divotColor ? (<div className="divot" />) : null;
}

function Paths({ tile }: { tile: TileState }) {
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
