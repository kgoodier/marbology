import React, { memo, useState } from 'react';

import { SolutionState } from './utils/types';

import './SolutionList.css';
import './SolutionTree.css';

type SolutionTreeProps = {
  solutions?: SolutionState,
  onViewBoard?: (name: string) => void,
  onSelectBoard?: (name: string) => void,
};

function Node({ name, children, onSelect }: { name: string, children: Array<string>, onSelect?: (name: string) => void }) {
  const [selectedName, setSelectedName] = useState(name);
  const names = children.length === 0 ? [name] : children;

  function handleSelect(name: string) {
    setSelectedName(name);
    onSelect && onSelect(name);
  }

  return (
    <div>
      <div className='solution-node name' onClick={() => handleSelect(name)}>
        {name}
      </div>
      <div className='solution-node-container' key={name}>
        {names.map((name, index) => {
          let className = 'solution-node child';
          if (selectedName === name) {
            className += ' selected';
          }
          return (
            <div key={name} className={className} onClick={() => handleSelect(name)}>
              {name}
            </div >
          );
        })}
      </div>
    </div>
  );
}

const SolutionTree = memo(function SolutionTree({ solutions, onViewBoard, onSelectBoard }: SolutionTreeProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [selectedName, setSelectedName] = useState<string | undefined>(undefined);

  if (!solutions) {
    return null;
  }

  function handleSelected(index: number) {
    setSelectedIndex(index);
    setSelectedName(nodes[index]);
    onViewBoard && onViewBoard(nodes[index]);
  }

  const divs = [];
  const nodes: Array<string> = [];
  let solution = solutions;
  while (solution) {
    const name = solution.name;
    const index = divs.length;

    let className = 'solution-level';
    if (selectedIndex !== undefined) {
      const distance = Math.min(6, Math.abs(selectedIndex - index));
      className += ` s${distance}`;
    }

    // emit
    nodes.push(name)
    divs.push(
      <div key={name} className={className} onMouseEnter={() => handleSelected(index)} onClick={() => onSelectBoard && onSelectBoard(name)}>
        <Node name={name} children={solution.children.map(child => child.name)} />
      </div >
    );

    // Follow the first child, unless the user has selected a different one.
    let childToFollow = solution.children[0];
    solution.children.forEach(child => {
      if (selectedName && child.name === selectedName) {
        childToFollow = child;
      }
    });
    solution = childToFollow;
  }

  return (
    <div className='solution-container'>
      {divs}
    </div>
  );

});

export default SolutionTree;

