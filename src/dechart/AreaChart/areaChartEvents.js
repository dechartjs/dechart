import * as d3 from 'd3';
import {
  makeBisector,
  valueSum,
} from '../utils';
import SyntheticEvent from '../SyntheticEvent';

export default function (AreaChart) {
  AreaChart.prototype.attachEventHandlers = function () {
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
  return AreaChart;
}

function makeSyntheticEvent(that, svgRootInnerNode) {
  if (svgRootInnerNode === undefined) return;

  const mouseCoord = d3.mouse(svgRootInnerNode);
  const xVal = that.xScale.invert(mouseCoord[0]);
  const _xIdx = makeBisector('date')(that.data.values, xVal);
  const xIdx = _xIdx >= that.data.values.length ? that.data.values.length - 1 : _xIdx;
  const data = that.data.values[xIdx];
  const bulbX = [ that.xScale(data.date) ];
  const bulbY = [ that.yScale(valueSum(data)) ];

  return new SyntheticEvent({
    bulbX,
    bulbY,
    clientX: mouseCoord[0],
    clientY: mouseCoord[1],
    date: data.date,
    data,
    xIdx,
  });
}

function handleMousemoveForBulb(that, syntheticEvent) {
  const {
 bulbX, bulbY, data 
} = syntheticEvent;

  that.$bulb.select('.x-hover-line')
    .attr('y2', (d) => {
      return that.yScale(that.yMax - valueSum(data));
    });

  that.$bulb.select('.y-hover-line')
    .attr('x2', (d) => {
      return -bulbX[0];
    });

  that.$bulb
    .attr('transform', (d) => (
      `translate(${bulbX[0]}, ${bulbY[0]})`
    ));
}
