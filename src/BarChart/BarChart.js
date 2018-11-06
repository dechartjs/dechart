import * as d3 from 'd3';

import BarChartEvents from './BarChartEvents';
import DechartBase from '../DechartBase';
import { SVG_ROOT_INNER } from '../dechart';
import {
  abbrNum,
  compose,
  createEvenlySpacedArray,
  getMonthName,
  isMidnight,
  makeWrap,
  normalizeMaxValue,
  pick,
} from '../utils';

const defaultOptions = {
  areaOpacity: 1.0,
  backgroundColor: '#fff',
  barColor: '#3cc187',
  barColorHover: '#d1ebf9',
  barWidth: undefined,
  gridColor: '#dfe1e5',
  legendHeight: 22,
  marginBottom: 23,
  marginLeft: 35,
  marginRight: 30,
  marginTop: 5,
  minYScale: false,
  paddingLeft: 21,
  paddingRight: 21,
  showGrid: true,
  showLegend: false,
  showXAxis: true,
  showYAxis: true,
  xAxisFontColor: '#727a77',
  xAxisFontSize: '12px',
  xAxisTicks: 0,
  yAxisFontColor: '#727a77',
  yAxisFontSize: '12px',
  yAxisTicks: 5,
};

class BarChart extends DechartBase {
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
    this.yMin = null;

    this.$svgRootInner = null;

    this.renderProxy();
  }

  hasDrawableData() {
    const { data, options } = this;
    return data != null
        && (data.values != null && data.values.length > 0)
        && (data.keys || options.selectedSeries);
  }

  preprocess() {
    const {
      data,
      options,
    } = this;
    const {
      keys,
      values,
    } = data;
    const sortedData = [ ...values ].sort((value1, value2) => {
      const date1 = new Date(value1.date);
      const date2 = new Date(value2.date);
      if (date1 > date2) {
        return 1;
      } else if (date1 < date2) {
        return -1;
      } else {
        return 0;
      }
    });
    const processedData = [];
    sortedData.forEach((d) => {
      processedData.push({
        key: d3.isoParse(d.date),
        value: keys
          ? +d[Object.keys(keys)[0]]
          : +d[options.selectedSeries],
      });
    });
    this.data = processedData;

    const {
      xAxisTicks,
      barWidth,
      marginLeft,
      marginRight,
      paddingLeft,
      paddingRight,
      width,
    } = this.options;
    if (barWidth && !width) {
      this.options.width = ((xAxisTicks + barWidth) * processedData.length)
        + paddingLeft + paddingRight + marginLeft + marginRight;
    } else if (!barWidth && width) {
      this.options.barWidth = (width - paddingLeft - paddingRight)
        / processedData.length - xAxisTicks;
    }
  }

  render() {
    const willDraw = this.hasDrawableData();
    if (!willDraw) {
      return false;
    }

    this.preprocess();
    this.renderRoot();
    this.options.showGrid && this.renderGrid();
    this.options.showXAxisLine && this.renderXAxisLine();
    this.options.showXAxis && this.renderXAxis();
    this.options.showYAxis && this.renderYAxis();
    this.renderBars();

    return true;
  }

  renderBars() {
    const {
      data,
      options,
      pureHeight,
      xScale,
      yScale,
      $svgRootInner: rootInner,
    } = this;

    const bars = rootInner.selectAll('.chunk')
      .data(data);

    bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.key))
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => (pureHeight - yScale(d.value)))
      .attr('width', options.barWidth);

    bars.attr('x', (d) => xScale(d.key))
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => (pureHeight - yScale(d.value)))
      .attr('width', options.barWidth);

    bars.exit()
      .remove();
  }

  renderGrid() {
    const {
      options,
      pureWidth,
      yMax,
      yMin,
      yScale,
      $svgRootInner: rootInner,
    } = this;

    const yGrid = d3.axisLeft(yScale)
      .tickFormat('')
      .tickValues(createEvenlySpacedArray(yMin, yMax, options.yAxisTicks))
      .tickSize(-pureWidth);

    rootInner.append('g')
      .attr('class', 'grid')
      .call(yGrid);

    rootInner.selectAll('.grid')
      .select('line')
      .attr('data-dechart-className', 'first-grid-line');
  }

  renderRoot() {
    const {
      data,
      options,
      pureHeight,
      pureWidth,
      $svgRoot: svgRoot,
    } = this;

    svgRoot
      .style('background-color', options.backgroundColor)
      .style('height', options.height - options.legendHeight)
      .style('width', options.width);
    this.$svgRootInner = svgRoot.append('g')
      .attr('class', SVG_ROOT_INNER)
      .attr('transform', `translate(${options.marginLeft}, ${options.marginTop})`);

    this.yMax = normalizeMaxValue(d3.max(data, (d) => pick((a, b) => a > b, d, 'value')));
    this.yMin = d3.min(data, (d) => pick((a, b) => a < b, d, 'value'));

    if (this.yMax === this.yMin) {
      this.yMin = this.yMin / 2;
      this.yMax = this.yMax + this.yMin;
    }

    this.xScale = d3.scaleBand()
      .domain(data.map((d) => d.key))
      .range([ options.paddingLeft, pureWidth - options.paddingRight ]);
    this.yScale = d3.scaleLinear()
      .domain([ options.minYScale ? this.yMin : 0, this.yMax ])
      .range([ pureHeight, 0 ]);
  }

  renderXAxis() {
    const {
      options,
      pureHeight,
      xScale,
      $svgRootInner: svgInner,
    } = this;

    const xAxis = d3.axisBottom(xScale)
      .tickFormat((key) => getMonthName(key, false))
      .ticks(options.xAxisTicks);

    const xAxisTicks = svgInner.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${pureHeight})`)
      .call(xAxis);

    xAxisTicks.selectAll('path')
      .style('display', 'none');

    xAxisTicks.selectAll('line')
      .attr('class', (date) => (isMidnight(date) ? '' : 'hide'));

    xAxisTicks.selectAll('text')
      .call(makeWrap(3))
      .attr('dx', -0.5 * options.xAxisTicks)
      .attr('dy', '9px')
      .attr('font-size', options.xAxisFontSize);
  }

  renderYAxis() {
    const {
      options,
      yMax,
      yMin,
      yScale,
      $svgRootInner: svgInner,
    } = this;

    const yAxis = d3.axisLeft(yScale)
      .tickValues(createEvenlySpacedArray(yMin, yMax, options.yAxisTicks))
      .tickFormat((d) => abbrNum(d, 1));

    const yAxisTicks = svgInner.append('g')
      .attr('class', 'axis axis-y')
      .call(yAxis);

    yAxisTicks.selectAll('line')
      .attr('display', 'none');
    yAxisTicks.selectAll('text')
      .attr('x', '0')
      .attr('dy', '1.2em')
      .attr('text-anchor', 'start')
      .attr('font-size', options.yAxisFontSize);
  }

  style() {
    const {
      cssNamespace: ns,
      options,
    } = this;
    return `
      ${ns} .area {
        fill: blue;
      }

      ${ns} .axis {
        stroke: #cccccc;
      }

      ${ns} .axis line {
        stroke: #cccccc;
      }

      ${ns} .axis path {
        stroke: transparent;
      }

      ${ns} .axis text {
        stroke: transparent;
        stroke-width: 0px;
        text-anchore: start;
      }

      ${ns} .axis-x {
        stroke: #cccccc;
      }

      ${ns} .axis-x text {
        fill: ${options.xAxisFontColor};
      }

      ${ns} .axis-y {
        stroke: transparent;
      }

      ${ns} .axis-y text {
        fill: ${options.yAxisFontColor};        
      }

      ${ns} .bar {
        fill: ${options.barColor};
        stroke-width: 0px;
      }

      ${ns} .bar:hover {
        fill: ${options.barColorHover};
      }

      ${ns} .domain path {
        stroke: transparent;
      }

      ${ns} .grid line {
        stroke: ${options.gridColor};
      }

      ${ns} .grid path {
        stroke: transparent;
      }
    `;
  }
}

export default BarChart;
