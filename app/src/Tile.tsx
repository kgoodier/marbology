import React, { PropsWithChildren } from 'react';
import { TileState } from './utils/types';

import './Tile.css'

const palette: Map<string, string> = new Map();
palette.set('A', '143, 182, 24');
palette.set('B', '163, 33, 52');
palette.set('Z', '0, 0, 0');
const defaultColor = '80, 80, 80';

function ballColor(c: string): string {
  let p = palette.get(c) ?? defaultColor;
  return `rgb(${p})`;
}

function ringColor(c: string): string {
  let p = palette.get(c) ?? defaultColor;
  return `radial-gradient(rgba(${p}, 0.0) 55%, rgba(${p}, 0.75) 55.5%, rgb(${p}) 51.5%)`;
}

export default function Tile({tile}: PropsWithChildren<{tile: TileState}>) {
  if (tile.isEmpty) {
    return (
      <div></div>
    );
  }

  if (tile.divotColor) {
    console.log(JSON.stringify(tile, null, '  '));
  }

  function Ring() {
    if (tile.divotColor && tile.divotColor !== 'Z') {
      return (
        <div className="ring" style={{ background: ringColor(tile.divotColor) }} />
      );
    } else {
      return null;
    }
  }

  function Ball() {
    if (tile.ballColor) {
      return (
        <div className="ball" style={{ background: ballColor(tile.ballColor) }} />
      );
    } else {
      return null;
    }
  }

  return (
    <div className="tile">
      <Ring />
      {tile.divotColor ? (<div className="divot"/>) : undefined}
      {tile.exits[0] ? (<div className="path u"/>) : undefined}
      {tile.exits[1] ? (<div className="path r"/>) : undefined}
      {tile.exits[2] ? (<div className="path d"/>) : undefined}
      {tile.exits[3] ? (<div className="path l"/>) : undefined}
      <Ball />
    </div>
  );
}
