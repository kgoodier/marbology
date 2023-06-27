import React, { PropsWithChildren, useEffect, useState } from 'react';

import ReactECharts from 'echarts-for-react';

export default function SolutionTree() {
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
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'tree',
        data: [data],
        symbol: 'emptyCircle',
        symbolSize: 20,
        orient: 'vertical',
        expandAndCollapse: false,
        label: {
          position: 'inside',
          verticalAlign: 'middle',
          fontSize: 9
        },
        animationDurationUpdate: 250
      }
    ]
  };

  return <ReactECharts option={options} />;
}
