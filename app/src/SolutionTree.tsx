import React, { PropsWithChildren, memo, useEffect, useState } from 'react';

import ReactECharts from 'echarts-for-react';
import { Solutions } from './utils/types';

import './SolutionTree.css';

type SolutionTreeProps = {
  solutions?: Solutions,
  onSelect?: (name: string) => void,
  onDebug?: (name: string) => void,
};

const SolutionTree = memo(function SolutionTree({ solutions, onSelect, onDebug }: SolutionTreeProps) {
  const [selected, setSelected] = useState<number | undefined>(undefined);

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

  const handleDebugInfo = (params: any) => {
    if (params.componentType === 'series') {
      onDebug && onDebug(params.data.name);
    }
  }

  const handleSelect = (params: any) => {
    if (params.componentType === 'series') {
      onSelect && onSelect(params.data.name);
    }
  }

  // 
  let options = {};
  if (hasBranches) {
    options = {
      tooltip: {
        show: false,
        trigger: 'item',
        triggerOn: 'click'
      },
      series: [
        {
          type: 'tree',
          data: [solutions],
          top: '4%',
          right: '4%',
          bottom: '4%',
          left: '4%',
          symbol: 'emptyCircle',
          symbolSize: 20,
          orient: 'vertical',
          expandAndCollapse: false,
          initialTreeDepth: 6,
          animationDurationUpdate: 250,
          roam: true,
          label: {
            position: 'inside',
            verticalAlign: 'middle',
            fontSize: 9
          },
          emphasis: {
            focus: 'ancestor',
          },
          /*
          selectedMode: 'single',
          select: {
            itemStyle: {
              color: 'blue'
            },
          }
          */
        }
      ]
    };

    return <ReactECharts
      option={options}
      style={{ height: '100%', width: '100%' }}
      onEvents={{
        'mouseover': handleSelect,
        'click': handleDebugInfo,
      }}
    />;
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
      setSelected(index);
      onSelect && onSelect(nodes[index]);
    }

    console.log(`render, selected=${selected}`);
    const solutionDivs = nodes.map((name, index) => {
      let className = `solution-node`;
      if (selected !== undefined) {
        const distance = Math.min(6, Math.abs(selected - index));
        console.log(`distance=${distance}`);
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

