import React from 'react';


import {
  Chart,
  BarSeries,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, SelectionState } from '@devexpress/dx-react-chart';
import { Animation } from '@devexpress/dx-react-chart';


export default React.memo(({postReactionData, clickChart, selection}) => {
  return <Chart
    data={postReactionData}
    rotated
  >
    <ArgumentAxis />
    <ValueAxis />

    <BarSeries
      valueField="count"
      argumentField="emotion"
    />
    <Animation />
    <EventTracker onClick={({ targets }) => clickChart(targets, 'post')} />
    <SelectionState selection={selection} />
    <Tooltip />
  </Chart>;
});