import React from 'react';

import {
  Chart,
  BarSeries,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
  Legend,
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, SelectionState } from '@devexpress/dx-react-chart';
import { Stack } from '@devexpress/dx-react-chart';
import { withStyles } from '@material-ui/core/styles';


const legendStyles = () => ({
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
  },
});
const legendRootBase = ({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
);
const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);
const legendLabelStyles = () => ({
  label: {
    whiteSpace: 'nowrap',
  },
});
const legendLabelBase = ({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
);
const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);


export default React.memo(({ commentReactionData, clickChart, selection }) => {

  return <Chart
    data={commentReactionData}
    rotated
    height={commentReactionData.length * 30 < 800 ? 800 : commentReactionData.length * 30}
  >
    <ArgumentAxis />
    <ValueAxis />

    <BarSeries
      name="LIKE"
      valueField="LIKE"
      argumentField="name"
      color="blue"
    />
    <BarSeries
      name="LOVE"
      valueField="LOVE"
      argumentField="name"
      color="pink"
    />
    <BarSeries
      name="HAHA"
      valueField="HAHA"
      argumentField="name"
      color="green"
    />
    <BarSeries
      name="WOW"
      valueField="WOW"
      argumentField="name"
      color="yellow"
    />
    <BarSeries
      name="SAD"
      valueField="SAD"
      argumentField="name"
      color="violet"
    />
    <BarSeries
      name="ANGRY"
      valueField="ANGRY"
      argumentField="name"
      color="red"
    />

    <EventTracker onClick={({ targets }) => clickChart(targets, 'comment')} />
    <SelectionState selection={selection} />
    <Tooltip />
    <Legend position="top" rootComponent={Root} labelComponent={Label} />
    <Stack
      stacks={[
        { series: ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'] },
      ]}
    />
  </Chart>
});