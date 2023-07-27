import React, { memo, useState } from 'react';

import { SolutionState } from './utils/types';

import './SolutionList.css';

type SolutionListProps = {
  solutionsPath?: SolutionState[],
  onViewBoard?: (name: string) => void,
  onSelectBoard?: (name: string) => void,
};

const SolutionList = memo(function SolutionList({ solutionsPath, onViewBoard, onSelectBoard }: SolutionListProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

  if (!solutionsPath) {
    return null;
  }

  const nodes: Array<string> = solutionsPath.map(s => s.name);

  function handleMouseEnter(index: number) {
    setSelectedIndex(index);
    onViewBoard && onViewBoard(nodes[index]);
  }

  const solutionDivs = nodes.map((name, index) => {
    let className = `solution-level`;
    if (selectedIndex !== undefined) {
      const distance = Math.min(6, Math.abs(selectedIndex - index));
      className += ` s${distance}`;
    }
    return (
      <div key={name} className={className} onMouseEnter={() => handleMouseEnter(index)} onClick={() => onSelectBoard && onSelectBoard(name)}>
        {index}
      </div >);
  });

  return (
    <div className='solution-container'>
      {solutionDivs}
    </div>
  )
});

export default SolutionList;

