import React, { PropsWithChildren } from 'react';
import { TileState } from './utils/types';

import './Tile.css'

// x and y are 1-based, to match CSS grid.
export default function Tile({ x, y, tile }: PropsWithChildren<{ x: number, y: number, tile: TileState }>) {
  if (tile.isEmpty) {
    return null;
  }

  let style = {
    gridColumnStart: x,
    gridRowStart: y,
    /*
    gridColumnEnd: `span ${tile.siblingDirection === 'right' ? 2 : 1}`,
    gridRowEnd: `span ${tile.siblingDirection === 'bottom' ? 2 : 1}`,
    //aspectRatio: `2 / ${tile.siblingDirection === 'right' ? 1 : tile.siblingDirection === 'bottom' ? 4 : 2}`
    aspectRatio: `2 / ${tile.siblingDirection === 'right' || tile.siblingDirection === 'bottom' ? 1 : 2}`
    */
  };

  let className = 'tile';
  if (tile.siblingDirection === 'bottom') {
    className += ' vertical';
  }

  return (
    <div className={className} style={style}>
      <Border siblingDirection={tile.siblingDirection} />
      <Ring divotColor={tile.divotColor} />
      <Divot divotColor={tile.divotColor} />
      <Paths tile={tile} />
    </div>
  );
  //<Ball ballColor={tile.ballColor} />
}

function Border({ siblingDirection }: { siblingDirection?: string }) {
  let borderClassName = 'border';
  if (siblingDirection === 'right') {
    borderClassName += ' sibling r';
  } else if (siblingDirection === 'left') {
    borderClassName += ' sibling l';
  } else if (siblingDirection === 'bottom') {
    borderClassName += ' sibling d';
  } else if (siblingDirection === 'top') {
    borderClassName += ' sibling u';
  }

  return <div className={borderClassName} />;
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
      <div className="path-base">
        {tile.exits[0] ? (<div className="path v u" />) : undefined}
        {tile.exits[1] ? (<div className="path h r" />) : undefined}
        {tile.exits[2] ? (<div className="path v d" />) : undefined}
        {tile.exits[3] ? (<div className="path h l" />) : undefined}
      </div>
    );
  } else if (!tile.siblingDirection) {
    // 1x1 tile without a divot
    return (
      <div className="path-base">
        {tile.exits[0] ? (<div className="path v u" />) : undefined}
        {tile.exits[1] ? (<div className="path h r" />) : undefined}
        {tile.exits[2] ? (<div className="path v d" />) : undefined}
        {tile.exits[3] ? (<div className="path h l" />) : undefined}
      </div>
    );
  } else {
    // 1x2 tile without a divot
    return (
      <div className="path-base">
        {tile.exits[0] ? (<div className="path v u" />) : undefined}
        {tile.exits[1] ? (<div className="path h r" />) : undefined}
        {tile.exits[2] ? (<div className="path v d" />) : undefined}
        {tile.exits[3] ? (<div className="path h l" />) : undefined}
      </div>
    );
  }

}
