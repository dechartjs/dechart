import * as d3 from 'd3';

import { makeBisector } from '../utils';
import SyntheticEvent from '../SyntheticEvent';

export default function (BarChart) {
  BarChart.prototype.attachEventHandlers = function () {
    const that = this;
    const svgRootInnerNode = that.$svgRootInner && that.$svgRootInner.node();

    that.$svgRoot
      .on('mouseover', () => {
        that.emit('mouseover', {});
      })

      .on('mouseout', () => {
        that.emit('mouseout', {});
      })

      .on('mousemove', () => {
        const syntheticEvent = makeSyntheticEvent(that, svgRootInnerNode);
        that.emit('mousemove', syntheticEvent);
      });
  };

  return BarChart;
}

function makeSyntheticEvent(that, svgRootInnerNode) {
  if (svgRootInnerNode === undefined) return null;

  const [ clientX, clientY ] = d3.mouse(svgRootInnerNode);
  // console.log(5555, that.xScale.range());
  // console.log(6666, that.xScale.bandwidth());

  return new SyntheticEvent({
    bulbX: [ clientX ],
    bulbY: [ clientY ],
    clientX,
    clientY,
    // selectedData,
    // xIdx,
  });
}

function getBulbY(yScale, selectedData) {
  const bulbY = [];
  for (const key in selectedData) {
    key !== 'date' && bulbY.push(yScale(+selectedData[key]));
  }

  return bulbY;
}

function createSelectedData(data, keys) {
  const obj = {};
  keys.forEach((key) => {
    obj[key] = data[key];
  });
  obj.date = data.date;
  return obj;
}
