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

const labelSelector = '#center-axis-container > div:nth-child(1) > svg > g > text';

export default React.memo(({ commentReactionData, clickChart, selection }) => {


  const labelClickEvent = (idx) => () => {
    clickChart([{point:idx}], 'comment');
  }
  
  const appendLabelEvent = (labelSize) => {
    const innerLabelSize = labelSize;
    setTimeout(() => {
      const labelElementList = document.querySelectorAll(labelSelector);
      if (innerLabelSize !== labelElementList.length) {
        appendLabelEvent(innerLabelSize);
      } else {
        labelElementList.forEach((el, idx) => {
          el.setAttribute('style', 'cursor:pointer');
          el.addEventListener('click', labelClickEvent(idx), false);
        });
      }
    }, 1000);
  }

  
  React.useEffect(() => {
    if (commentReactionData.length === 0) {
      return;
    }

    appendLabelEvent(commentReactionData.length);

    return () => {
      document.querySelectorAll(labelSelector).forEach((el, idx) => {
        el.removeEventListener('click', labelClickEvent(idx), false);
      });
    }
  }, [commentReactionData]);

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