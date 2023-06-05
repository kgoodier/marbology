import React, { PropsWithChildren } from 'react';
import { TileState } from './utils/types';

import './Tile.css'

// x and y are 1-based, to match CSS grid.
export default function Tile({x, y, tile}: PropsWithChildren<{x: number, y: number, tile: TileState}>) {
  if (tile.isEmpty || tile.siblingDirection === "left" || tile.siblingDirection === "top") {
    return null;
  }

  let style = {
    gridColumnStart: x,
    gridRowStart: y,
    gridColumnEnd: `span ${tile.siblingDirection === 'right' ? 2 : 1}`,
    gridRowEnd: `span ${tile.siblingDirection === 'bottom' ? 2 : 1}`,
    //aspectRatio: `2 / ${tile.siblingDirection === 'right' ? 1 : tile.siblingDirection === 'bottom' ? 4 : 2}`
    //aspectRatio: `2 / ${tile.siblingDirection === 'right' || tile.siblingDirection === 'bottom' ? 1 : 2}`
  };

  let className = 'tile';
  if (tile.siblingDirection === 'bottom') {
    className += ' vertical';
  }

  return (
    <div className={className} style={style}>
    </div>
  );
}
