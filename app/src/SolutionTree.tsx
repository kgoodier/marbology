import React, { PropsWithChildren, memo, useEffect, useState } from 'react';

import ReactECharts from 'echarts-for-react';
import { Solutions } from './utils/types';

import './SolutionTree.css';

type SolutionTreeProps = {
  solutions?: Solutions,
  onSelect?: (name: string) => void,
  onDebug?: (name: string) => void,
};

function Node({ name, children }: { name: string, children: Array<string> }) {
  const names = children.length === 0 ? [name] : children;
  return (
    <div>
      <div className='solution-node name'>
        {name}
      </div>
      <div className='solution-node-container' key={name}>
        {names.map((name, index) => {
          return (
            <div key={name} className='solution-node child'>
              {name}
            </div >
          );
        })}
      </div>
    </div>
  );
}

const SolutionTree = memo(function SolutionTree({ solutions, onSelect, onDebug }: SolutionTreeProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [selectedName, setSelectedName] = useState<string | undefined>(undefined);

  if (!solutions) {
    return null;
  }

  // Calculcate whether solutions is a non-branching tree or not.
  const isStraightLine = (solutions: Solutions): boolean => {
    if (solutions.children.length === 1) {
      return isStraightLine(solutions.children[0]);
    } else {
      return solutions.children.length === 0;
    }
  }
  const hasBranches = !isStraightLine(solutions);

  if (hasBranches) {
    function handleSelected(index: number) {
      setSelectedIndex(index);
      setSelectedName(nodes[index]);
      onSelect && onSelect(nodes[index]);
    }

    const divs = [];
    const nodes: Array<string> = [];
    let solution = solutions;
    while (solution) {
      const name = solution.name;
      const index = divs.length;
      console.log(name, index, selectedIndex, selectedName)

      let className = 'solution-level';
      if (selectedIndex !== undefined) {
        const distance = Math.min(6, Math.abs(selectedIndex - index));
        className += ` s${distance}`;
      }

      // emit
      nodes.push(name)
      divs.push(
        <div key={name} className={className} onMouseEnter={() => handleSelected(index)} onClick={() => onDebug && onDebug(name)}>
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
    )

  } else {
    // Render the tree as a list (straight line). wtf is the real name.
    const nodes: Array<string> = [];
    const links = [];
    let solution = solutions;
    while (solution) {
      nodes.push(solution.name);
      if (solution.children.length > 0) {
        links.push({ source: solution.name, target: solution.children[0].name });
      }
      solution = solution.children[0];
    }

    function handleSelected(index: number) {
      setSelectedIndex(index);
      setSelectedName(nodes[index]);
      onSelect && onSelect(nodes[index]);
    }

    const solutionDivs = nodes.map((name, index) => {
      let className = `solution-level`;
      if (selectedIndex !== undefined) {
        const distance = Math.min(6, Math.abs(selectedIndex - index));
        className += ` s${distance}`;
      }
      return (
        <div key={name} className={className} onMouseEnter={() => handleSelected(index)} onClick={() => onDebug && onDebug(name)}>
          {index}
        </div >);
    });

    return (
      <div className='solution-container'>
        {solutionDivs}
      </div>
    )
  }
});

export default SolutionTree;

