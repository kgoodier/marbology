import React, { PropsWithChildren } from 'react';
import './Board.css'

export default function Board(props: PropsWithChildren) {
  return (
    <div className="container">
      <div className="components">
        {props.children}
      </div>
    </div>
  );
}