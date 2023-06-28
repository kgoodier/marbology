import React, { PropsWithChildren, useEffect, useState } from 'react';

import ReactECharts from 'echarts-for-react';
import { Solutions } from './utils/types';

export default function SolutionTree({ solutions, onSelect }: { solutions?: Solutions, onSelect?: (name: string) => void }) {
  if (!solutions) {
    return null;
  }

  console.log('!!! render SolutionTree');

  const data = {
    name: "1",    // the name of the node, the text corresponding to the current node label.
    children: [
      {
        name: "2",
        //collapsed: null, // If set as `true`, the node is collapsed in the initialization.
        children: [
          {
            name: "4"
          },
          {
            name: "5"
          }
        ]
      },
      {
        name: "3",
      }
    ]
  };
  const options = {
    tooltip: {
      show: true,
      trigger: 'item',
      triggerOn: 'click'
    },
    series: [
      {
        type: 'tree',
        data: [solutions],
        symbol: 'emptyCircle',
        symbolSize: 20,
        orient: 'vertical',
        expandAndCollapse: true,
        animationDurationUpdate: 250,
        roam: true,
        label: {
          position: 'inside',
          verticalAlign: 'middle',
          fontSize: 9
        },
        selectedMode: 'single',
        select: {
          itemStyle: {
            color: 'red'
          },
          label: {
            show: true
          }
        }
      }
    ]
  };

  const onSelectChanged = (params: any) => {
    if (params.fromAction === 'select') {
      console.log(params);
    }
  }

  const onClick = (params: any) => {
    if (params.componentType === 'series') {
      // DEBUGGING
      console.log(params);

      /*
      // Build array of children
      function mapChildren(node: any) {
        if (!node.children) {
          return [];
        }
        return node.children.map((child: any) => {
          return {
            name: child.name,
            children: mapChildren(child)
          };
        });
      }
      const children = mapChildren(params.data);
      const ancestors = params.treeAncestors.map((node: any) => node.name);
      console.log(ancestors, children);
      */

      onSelect && onSelect(params.data.name);
    }
  }

  return <ReactECharts
    option={options}
    onEvents={{
      'mouseover': onClick,
      'selectchanged': onSelectChanged
    }}
  />;
}
