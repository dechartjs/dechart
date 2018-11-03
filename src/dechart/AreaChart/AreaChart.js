import * as d3 from 'd3';

import areaChartEvents from './areaChartEvents';
import {
  compose,
  valueSum,
} from '../utils';
import DechartBase from '../DechartBase';
import {
  SVG_ROOT,
  SVG_ROOT_INNER,
} from '../dechart';

const defaultOptions = {
  areaOpacity: 1.0,
  legendHeight: 22,
  marginBottom: 23,
  marginLeft: 35,
  marginRight: 30,
  marginTop: 5,
  minYScale: false,
  showBulb: true,
  showGrid: true,
  showLegend: true,
  showLinePath: false,
  showXAxis: true,
  showYAxis: true,
  xAxisFontSize: '12px',
  xAxisTicks: 0,
  yAxisFontSize: '12px',
  yAxisTicks: 2,
};

const setEnclosingPath = (line, stackData, xScale, yScale) => {
  return stackData.map((data) => {
    const top = data.map((d, idx) => [ xScale(d.data.date), yScale(d[1]) ]);
    const bottom = data.map((d, idx) => [ xScale(d.data.date), yScale(d[0]) ]).reverse();

    return {
      ...data,
      path: line(top) + line(bottom).replace('M', 'L') + 'Z',
      topPath: line(top),
    };
  });
};

class AreaChart extends DechartBase {
  constructor({
    chartType,
    componentId,
    data,
    options,
  }) {
    super({
      chartType,
      componentId,
      data,
      defaultOptions,
      options,
    });
    this.xScale = null;
    this.yScale = null;
    this.yMax = null;

    this.$browser = null;
    this.$bulb = null;
    this.$svgRootInner = null;

    this.renderProxy();
  }

  hasDrawableData() {
    return (this.data.values || []).length > 0;
  }

  preprocess() {
    this.data.values.forEach((d) => {
      d.date = d3.isoParse(d.date);
    });
  }

  style() {
    const ns = this.cssNamespace;
    return `
      ${ns} .area {
        fill: blue;
      }

      ${ns} .grid path {
        stroke: transparent;
      }

      ${ns} .grid line {
        stroke: #dfe1e5;
      }
      
      ${ns} .line {
        stroke-width: 1px;
      }
      
      ${ns} .tick {
        font-size: 12px;
      }

      ${ns} .focus circle {
        fill: none;
        stroke: #808080;
        stroke-width: 1px;
      }
      
      ${ns} .hover-line {
        stroke: #808080;
        stroke-width: 2px;
        stroke-dasharray: 3,3;
      }
    `;
  }

  renderBulb() {
    this.$bulb = this.$browser.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    this.$bulb.append('line')
      .attr('class', 'x-hover-line hover-line')
      .attr('y1', 0)
      .attr('y2', 0);

    this.$bulb.append('line')
      .attr('class', 'y-hover-line hover-line')
      .attr('x1', 0)
      .attr('x2', 0);

    this.$bulb.append('circle')
      .attr('class', 'circle')
      .attr('r', 3.5);
  }

  renderGrid() {
    const yGrid = d3.axisLeft(this.yScale)
      .tickFormat('')
      .tickValues([ this.yMax / 2.0, this.yMax ])
      .tickSize(-this.pureWidth);

    const inner = this.$chartRoot.select(`.${SVG_ROOT} .${SVG_ROOT_INNER}`);
    if (!inner.empty()) {
      inner.append('g')
        .attr('class', 'grid')
        .call(yGrid);
    }
  }

  renderRoot() {
    if (!this.hasDrawableData()) return false;
    const { data } = this;

    this.$svgRoot
      .attr('width', this.options.width)
      .attr('height', this.options.height - this.options.legendHeight);
    this.$svgRootInner = this.$svgRoot.append('g')
      .attr('class', SVG_ROOT_INNER)
      .attr('transform', `translate(
        ${this.options.marginLeft},
        ${this.options.marginTop})`);

    this.yMax = d3.max(data.values, (d) => valueSum(d));
    this.yMin = d3.min(data.values, (d) => valueSum(d));

    this.xScale = d3.scaleTime()
      .domain(d3.extent(data.values, (d) => d.date))
      .range([ 0, this.pureWidth ]);

    this.yScale = d3.scaleLinear()
      .domain([ this.options.minYScale ? this.yMin : 0, this.yMax ])
      .range([ this.pureHeight, 0 ]);

    const line = d3.line()
      .curve(d3.curveMonotoneX);

    const keys = Object.keys(data.keys);
    const stack = d3.stack()
      .keys(keys)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const pathEnhancedStack = setEnclosingPath(line, stack(data.values), this.xScale, this.yScale);

    this.$browser = this.$svgRootInner.selectAll('.browser')
      .data(pathEnhancedStack)
      .enter()
      .append('g')
      .attr('class', (d) => `browser ${d.key}`);

    this.$browser.append('path')
      .attr('class', 'line')
      .attr('d', (d) => d.path)
      .attr('fill', (d) => data.keys[d.key].color)
      .style('opacity', this.options.areaOpacity);

    if (this.options.showLinePath) {
      this.$browser.append('path')
        .attr('class', 'line')
        .attr('d', (d) => d.topPath)
        .attr('stroke', (d) => data.keys[d.key].color)
        .attr('fill', 'transparent');
    }

    this.options.showGrid && this.renderGrid();
    this.options.showXAxis && this.renderXAxis();
    this.options.showYAxis && this.renderYAxis();
    this.options.showBulb && this.renderBulb(data);
    this.options.showLegend && this.renderLegend(data);

    return true;
  }

  renderXAxis() {
    const xAxis = d3.axisBottom(this.xScale)
      .tickFormat(d3.timeFormat('%m-%d'));

    this.$svgRootInner.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.pureHeight + ')')
      .call(xAxis);
  }

  renderYAxis() {
    this.$svgRootInner.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(this.yScale));
  }

  render() {
    this.preprocess();
    return this.renderRoot();
  }
};

export default compose(
  areaChartEvents,
)(AreaChart);
