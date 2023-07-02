import React, { PropsWithChildren, memo, useEffect, useState } from 'react';

import ReactECharts from 'echarts-for-react';
import { Solutions } from './utils/types';

type SolutionTreeProps = {
  solutions?: Solutions,
  onSelect?: (name: string) => void,
  onDebug?: (name: string) => void,
};

const SolutionTree = memo(function SolutionTree({ solutions, onSelect, onDebug }: SolutionTreeProps) {
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
  } else {
    // Render the tree as a list (straight line). wtf is the real name.
    const nodes = [];
    const links = [];
    let solution = solutions;
    while (solution) {
      nodes.push({ name: solution.name });
      if (solution.children.length > 0) {
        links.push({ source: solution.name, target: solution.children[0].name });
      }
      solution = solution.children[0];
    }

    options = {
      tooltip: {
        show: false,
        trigger: 'item',
        triggerOn: 'click'
      },
      series: [
        {
          name: 'Marbology',
          type: 'graph',
          layout: 'force',
          data: nodes,
          links: links,
          symbol: 'emptyCircle',
          symbolSize: 20,
          roam: false,
          label: {
            show: true,
            position: 'inside',
            verticalAlign: 'middle',
            fontSize: 9
          },
          force: {
            repulsion: 100
          }
        }
      ]
    };


  }


  return <ReactECharts
    option={options}
    style={{ height: '100%', width: '100%' }}
    onEvents={{
      'mouseover': handleSelect,
      'click': handleDebugInfo,
    }}
  />;
});

export default SolutionTree;

