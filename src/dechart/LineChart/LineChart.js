import * as d3 from 'd3';

import {
  abbrNum,
  compose,
  getFormattedDate,
  isMidnight,
  makeWrap,
  pick,
  createEvenlySpacedArray,
  normalizeMaxValue,
} from '../utils';
import DechartBase from '../DechartBase';
import lineChartEvents from './lineChartEvents';

const defaultOptions = {
  inChartLeftMargin: 21,
  inChartRightMargin: 21,
  legendHeight: 22,
  marginBottom: 31,
  marginLeft: 30,
  marginRight: 5,
  marginTop: 10,
  minYScale: false,
  showBulb: true,
  showGrid: true,
  showLegend: true,
  showXAxis: true,
  showYAxis: true,
  xAxisFontSize: '12px',
  xAxisTicks: 0,
  yAxisFontSize: '12px',
  yAxisTicks: 5,
};

class LineChart extends DechartBase {
  constructor({
    chartType,
    componentId,
    data,
    options,
  }) {
    super({
      ...arguments[0],
      defaultOptions,
    });
    this.xScale = null;
    this.yScale = null;
    this.yMax = null;
    this.yMin = null;

    this.$bulb = null;
    this.$svgRootInner = null;

    this.renderProxy();
  }

  hasDrawableData() {
    return this.data.keys 
      && this.data.values && this.data.values.length > 0;
  }

  preprocess() {
    const data = { ...this.data };
    data.values = [ ...this.data.values ];
    data.values.map((d) => {
      d.date = d3.isoParse(d.date);
    });
    data.values.sort((x, y) => {
      return x.date - y.date;
    });
    this.data = data;
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
        fill: none;
        stroke-width: 2px;
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

      ${ns} .axis-x .domain {
        stroke: #cccccc;
      }

      ${ns} .axis-y .domain {
        stroke: transparent;
      }

      ${ns} .axis text {
        fill: #727a77;
        text-anchor: start;
      }
      
      ${ns} .axis line {
        stroke: #cccccc;
      }

      ${ns} .tick {
        font-size: 12px;
      }

      ${ns} .legendWrapper .colorBox {
        height: 2px;
        margin-bottom: 3px;
        margin-right: 6px;
        width: 20px;
      }
    `;
  }

  renderBulb() {
    this.$bulb = this.$svgRootInner
      .append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    this.$bulb.append("line")
      .attr('class', 'x-hover-line hover-line')
      .attr('y1', 0)
      .attr('y2', 0);

    this.$bulb.append("line")
      .attr('class', 'y-hover-line hover-line')
      .attr('x1', 0)
      .attr('x2', 0);

    // this.$bulb.append('circle')
    //   .attr('class', 'circle')
    //   .attr('r', 3.5);
  }

  renderGrid() {
    const yGrid = d3.axisLeft(this.yScale)
      .tickFormat('')
      .tickValues(createEvenlySpacedArray(this.yMin, this.yMax, this.options.yAxisTicks))
      .tickSize(-this.pureWidth);

    this.$svgRootInner.append('g')
      .attr('class', 'grid')
      .call(yGrid);
  };

  renderRoot() {
    if (!this.hasDrawableData()) {
      return false;
    }

    const data = this.data;
    this.yMax = normalizeMaxValue(d3.max(
      data.values,
      (v) => pick((curr, prev) => curr > prev, v, Object.keys(data.keys))
    ));

    this.yMin = d3.min(
      data.values,
      (v) => pick((curr, prev) => curr < prev, v, Object.keys(data.keys))
    );

    if (this.yMax === this.yMin) {
      this.yMin = this.yMin / 2.0;
      this.yMax = this.yMax + this.yMin;
    }

    this.xScale = d3.scaleTime()
      .domain(d3.extent(data.values, (v) => {
        return v.date;
      }))
      .range([this.options.inChartLeftMargin, this.pureWidth - this.options.inChartRightMargin]);

    this.yScale = d3.scaleLinear()
      .domain([this.options.minYScale ? this.yMin : 0, this.yMax])
      .range([this.pureHeight, 0]);

    this.$svgRoot
      .attr("width", this.options.width)
      .attr("height", this.options.height - this.options.legendHeight)

    this.$svgRootInner = this.$svgRoot.append('g')
      .attr('class', 'svgRootInner')
      .attr('transform', `translate(
        ${this.options.marginLeft},
        ${this.options.marginTop})`);

    this.options.showGrid && this.renderGrid();  
    this.renderLine();
    this.options.showXAxis && this.renderXAxis();
    this.options.showYAxis && this.renderYAxis();
    this.options.showBulb && this.renderBulb();
    this.options.showLegend && this.renderLegend(data);
    
    return true;
  }

  renderLine() {
    const makeLine = (xKey = 'date', yKey) => {
      if (yKey === undefined) {
        throw new Error('LineChart needs yKey to make lines');
      }

      return d3.line()
        .x((d) => this.xScale(d[xKey]))
        .y((d) => this.yScale(d[yKey]));
    };

    const data = this.data
    const chunk = this.$svgRootInner
      .selectAll('.chunk')
      .data([data])
      .enter();

    for (let key in data.keys) {
      chunk.append('g')
        .attr('class', 'chunk')
        .append('path')
          .attr('class', 'line')
          .attr('d' , (d) => {
            return makeLine('date', key)(d.values);
          })
          .attr('stroke', (d) => {
            return d.keys[key].color;
          });
    }
  }

  renderXAxis() {
    const xAxis = d3.axisBottom(this.xScale)
      .tickFormat((date) => getFormattedDate(date));

    this.options.xAxisTicks > 0 && xAxis.ticks(this.options.xAxisTicks);

    const tickXAxis = this.$svgRootInner.append("g")
      .attr('class', 'axis axis-x')
      .attr("transform", "translate(0," + this.pureHeight + ")")
      .call(xAxis);

    tickXAxis.selectAll('path')
      .style('display', 'none');

    tickXAxis.selectAll('line')
      .attr('class', (date) => {
        return isMidnight(date) ? '' : 'hide';
      });
    
    tickXAxis.selectAll('text')
      .call(makeWrap(3))
      .attr('dx', '0em')
      .attr('dy', '9px')
      .attr('font-size', this.options.xAxisFontSize);
  }

  renderYAxis() {
    const yAxis = d3.axisLeft(this.yScale)
      .tickValues(createEvenlySpacedArray(this.yMin, this.yMax, this.options.yAxisTicks))
      .tickFormat((d, i) => abbrNum(d, 1));

    const tickYAxis = this.$svgRootInner.append("g")
      .attr('class', 'axis axis-y')
      .call(yAxis);

    tickYAxis.selectAll('line')
      .attr('display', 'none');

    tickYAxis.selectAll('text')
      .attr('x', '0')
      .attr('dy', '1.2em')
      .attr('text-anchor', 'start')
      .attr('font-size', this.options.yAxisFontSize);
  }

  render() {
    if (this.hasDrawableData()) {
      this.preprocess();
      return this.renderRoot();
    }
  }
};

export default compose(
  lineChartEvents,
)(LineChart);
