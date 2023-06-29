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

  console.log('!!! render SolutionTree');

  const options = {
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

