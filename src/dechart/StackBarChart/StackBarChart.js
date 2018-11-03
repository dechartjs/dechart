import * as d3 from 'd3';

import DechartBase from '../DechartBase';

const defaultOptions = {
  marginBottom: 51,
  marginLeft: 30,
  marginRight: 5,
  marginTop: 10,
  minYScale: false,
  showGrid: true,
  showLegend: true,
  showXAxis: true,
  showYAxis: true,
  xAxisTicks: 0,
  yAxisTicks: 0,
};

export default class StackBarChart extends DechartBase {
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
  }

  drawGrid(g, yScale, pureWidth) {
    // grid on x axis
    // g.append('g')
    //   .attr("class", "grid")
    //   .attr("transform", "translate(0," + pureHeight + ")")
    //   .call(d3.axisBottom(xScale)
    //     .tickValues(xScale.domain().filter((d, i) => {
    //       return (i % 2);
    //     }))
    //     .tickSize(-pureHeight)
    //     .tickFormat("")
    //   );
    // grid on y axis

    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-pureWidth)
        .tickFormat(''));
  }

  drawLegend(svg, margin) {
    const payload = this.data;

    const pureHeight = this.options.height - margin.top - margin.bottom;

    const legend = svg.append('g')
      .attr('class', 'legend-wrapper')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('.legend-wrapper')
      .data(payload.keys)
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        return `translate(${this.options.width / 2 + i * 80 - 90}, ${pureHeight + margin.top + margin.bottom / 2 + 5})`;
      });

    legend.append('rect')
      .attr('class', 'legend')
      .attr('x', 0)
      .attr('width', (d, i) => {
        return 16;
      })
      .attr('height', 10)
      .attr('fill', (d, i) => {
        return payload.keys[i].color;
      });

    legend.append('text')
      .attr('x', (d, i) => {
        return 15 + 7 * d.label.length;
      })
      .attr('y', 8)
      .attr('height', 10)
      .text((d) => {
        return d.label;
      });
  }


  render() {
    const payload = this.data;
    const {
      marginBottom,
      marginLeft,
      marginRight,
      marginTop,
      showGrid,
      showLegend,
      xAxisTicks,
      yAxisTicks,
    } = this.options;

    if (!payload || !payload.values) {
      return;
    }

    const series = d3.stack()
      .keys(payload.keys.map((key) => key.label))(payload.values);

    const margin = {
      bottom: marginBottom,
      left: marginLeft,
      right: marginRight,
      top: marginTop,
    };
    const pureWidth = this.options.width - margin.left - margin.right;
    const pureHeight = this.options.height - margin.top - margin.bottom;
    const dateExtent = d3.extent(payload.values, (d) => {
      return (d.x);
    });
    const startDate = new Date(dateExtent[0]);
    const endDate = new Date(dateExtent[1]);
    endDate.setDate(endDate.getDate() + 1);

    const xScale = d3.scaleTime()
      .domain([
        startDate,
        endDate,
      ])
      .rangeRound([ 5, pureWidth - 25 ]);

    const minY = this.options.minYScale
      ? d3.min(series[series.length - 1], (d) => d[1])
      : 0;
    const yScale = d3.scaleLinear()
      .domain([ minY, d3.max(series[series.length - 1], (d) => d[1]) ])
      .range([ pureHeight, 0 ])
      .nice();

    const svg = this.wrap.append('svg')
      .attr('width', this.options.width)
      .attr('height', this.options.height);

    const g = svg.append('g')
      .attr('class', 'graph')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    if (showGrid) {
      this.drawGrid(g, yScale, pureWidth);
    }

    const layer = g.selectAll('.layer')
      .data(series)
      .enter()
      .append('g')
      .attr('class', 'layer')
      .attr('fill', (d, i) => {
        return payload.keys[i].color;
      });

    const rect = layer.selectAll('rect')
      .data((d) => {
        d.map((elem) => {
          elem.key = d.key;
        });
        return d;
      })
      .enter()
      .append('rect')
      .attr('x', (d) => {
        return xScale(new Date(d.data.x));
      })
      .attr('y', pureHeight)
      .attr('width', () => {
        return 5;
      })
      .attr('height', 0);

    rect.transition()
      .delay((d, i) => {
        return i * 10;
      })
      .attr('y', (d) => {
        return yScale(d[1]);
      })
      .attr('height', (d) => {
        return yScale(d[0]) - yScale(d[1]);
      });

    if (this.options.showXAxis) {
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%y-%m'));
      if (xAxisTicks > 0) {
        xAxis.ticks(xAxisTicks);
      }
      g.append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', 'translate(0,' + pureHeight + ')')
        .call(xAxis)
        .selectAll('text')
        .attr('dy', '9px');
      // .attr('transform', 'rotate(-65)');
    }

    if (this.options.showYAxis) {
      const yAxis = d3.axisLeft(yScale);
      if (yAxisTicks > 0) {
        yAxis.ticks(yAxisTicks);
      }
      g.append('g')
        .attr('class', 'axis axis-y')
        .attr('transform', 'translate(0,0)')
        .call(yAxis);

      if (showLegend) {
        this.drawLegend(svg, margin);
      }
    }
  }
}
