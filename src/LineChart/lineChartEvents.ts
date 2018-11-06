import * as d3 from 'd3';
import { makeBisector } from '../utils';
import SyntheticEvent from '../SyntheticEvent';

export default function (LineChart) {
  LineChart.prototype.attachEventHandlers = function () {
    const that = this;
    const svgRootInnerNode = that.$svgRootInner && that.$svgRootInner.node();

    that.$svgRoot
      .on('mouseover', () => {
        that.$bulb.style('display', null);
        that.emit('mouseover', {});
      })

      .on('mouseout', () => {
        that.$bulb.style('display', 'none');
        that.emit('mouseout', {});
      })

      .on('mousemove', () => {
        const syntheticEvent = makeSyntheticEvent(that, svgRootInnerNode);

        handleMousemoveForBulb(that, syntheticEvent);
        that.emit('mousemove', syntheticEvent);
      });
  };

  return LineChart;
}

function makeSyntheticEvent(that, svgRootInnerNode) {
  if (svgRootInnerNode === undefined) return;

  const [ clientX, clientY ] = d3.mouse(svgRootInnerNode);
  const keys = Object.keys(that.data.keys);
  const xVal = that.xScale.invert(clientX);
  const _xIdx = makeBisector('date')(that.data.values, xVal);
  const xIdx = _xIdx >= that.data.values.length ? that.data.values.length - 1 : _xIdx;
  const selectedData = createSelectedData(that.data.values[xIdx], keys);
  const bulbX = [ that.xScale(selectedData['date']) ];
  const bulbY = getBulbY(that.yScale, selectedData);

  return new SyntheticEvent({
    bulbX,
    bulbY,
    clientX,
    clientY,
    selectedData,
    xIdx,
  });
}

function handleMousemoveForBulb(that, syntheticEvent) {
  const { bulbX } = syntheticEvent;

  that.$bulb.select('.x-hover-line')
    .attr('y2', that.yScale(0));

  // that.$bulb.select('.y-hover-line')
  //   .attr('x2', -bulbX);

  that.$bulb
    .attr(
      'transform',
      `translate(
        ${bulbX},
        0
      )`,
    );
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
  obj['date'] = data.date;
  return obj;
}
