import * as d3 from 'd3';

import DechartBase from '../DechartBase';

const defaultOptions = {
  height: 232,
  legendHeight: 36,
  showLegend: true,
};

export default class PieChart extends DechartBase {
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

    this.renderProxy();
  }

  hasDrawableData() {
    return (this.data.values || []).length > 0;
  }

  style() {
    const ns = this.cssNamespace;
    return `
      ${ns} path.slice {
        stroke: #fff;
      }

      ${ns} polyline {
        opacity: .3;
        stroke: black;
        stroke-width: 1px;
        fill: none;
      }

      ${ns} .labelValue {
        font-size: 60%;
        opacity: .5;
      }

      ${ns} .toolTip {
        position: absolute;
        display: none;
        width: auto;
        height: auto;
        background: none repeat scroll 0 0 white;
        border: 0 none;
        border-radius: 8px 8px 8px 8px;
        box-shadow: -3px 3px 15px #888888;
        color: black;
        font: 12px sans-serif;
        padding: 5px;
        text-align: center;
      }

      ${ns} text {
        fill: #ffffff;
        font: 12px SpoqaHanSans;
        font-weight: 100;
      }
    `;
  }

  renderRoot() {
    const { data } = this;
    const { height, width, legendHeight } = this.options;
    const margin = {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    };
    const pureHeight = height - legendHeight - margin.top - margin.bottom;
    const pureWidth = width - margin.left - margin.right;
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory20);

    this.$svgRoot
      .style('height', height - legendHeight)
      .style('width', width);

    const g = this.$svgRoot.append('g')
      .attr('class', 'g-wrapper')
      .append('g');

    g.append('g')
      .attr('class', 'slices');
    g.append('g')
      .attr('class', 'labelName');
    g.append('g')
      .attr('class', 'labelValue');
    g.append('g')
      .attr('class', 'lines');

    g.attr('transform', 'translate(' + pureWidth / 2 + ',' + pureHeight / 2 + ')');

    const pie = d3.pie()
      .sort(null)
      .value((d) => d.value);

    const arc = d3.arc()
      .innerRadius(radius * 0.50)
      .outerRadius(radius * 0.75);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.62)
      .outerRadius(radius * 0.62);

    const toolTip = this.$htmlRoot.append('div')
      .attr('class', 'toolTip');

    this.options.showLegend && this.renderLegend(data);

    const slice = g.select('.slices')
      .selectAll('path.slice')
      .data(pie(data.values));

    slice.enter()
      .insert('path')
      .style('fill', (d, i) => {
        return (data.keys[data.values[i].key]
          ? data.keys[data.values[i].key].color
          : color(i));
      })
      .style('opacity', 0.9)
      .attr('class', 'slice')
      .merge(slice)

      .transition()
      .duration(1000)
      .attrTween('d', (d) => {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return (t) => arc(interpolate(t));
      });

    g.select('.slices')
      .selectAll('path.slice')
      .on('mousemove', (d) => {
        toolTip.style('left', d3.event.clientX + 10 + 'px');
        toolTip.style('top', d3.event.clientY - 25 + 'px');
        toolTip.style('display', 'inline-block');
        toolTip.style('position', 'fixed');
        toolTip.html((d.data.key) + '<br>' + (Math.floor(d.data.value * 100) / 100));
      })
      .on('mouseout', (d) => toolTip.style('display', 'none'));

    slice.exit()
      .remove();

    const text = g.select('.labelName')
      .selectAll('text')
      .data(pie(data.values), (d) => d.data.key);

    text.enter()
      .append('text')
      .attr('style', 'text-anchor: middle;')
      .attr('dy', '.35em')
      .text((d) => {
        if (d.endAngle - d.startAngle >= 0.2) {
          return `${Math.floor(d.data.ratio)}%`;
        }
        return '';
      })
      .merge(text)

      .transition()
      .duration(1000)
      .attrTween('transform', (d) => {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return (t) => {
          const d2 = interpolate(t);
          const pos = outerArc.centroid(d2);
          return 'translate(' + pos + ')';
        };
      });

    text.exit()
      .remove();
  }

  render(data) {
    this.renderRoot(data);
  }
}
