import * as d3 from 'd3';

import {
  DECHART_CLASS_NAME,
  HTML_ROOT,
  SVG_ROOT,
} from './dechart';
import { pushToObject } from './utils';

const state = {
  styles: {},
};

export default class DechartBase {
  chartType: string;
  componentId: string;
  data: any;
  eventHandlers: EventHandlers;
  options: ChartOptions;
  $chartRoot: any;
  $htmlRoot: any;
  $svgRoot: any;

  constructor({
    chartType,
    componentId,
    data,
    defaultOptions,
    options,
  }) {
    this.beta__dispatch = this.beta__dispatch.bind(this);
    this.chartType = DechartBase.requireNonEmpty(chartType);
    this.componentId = DechartBase.requireNonEmpty(componentId, 'componentId');
    this.data = DechartBase.requireNonEmpty(data, 'data');
    this.eventHandlers = {};
    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.$chartRoot = null;
    this.$svgRoot = null;
    this.$htmlRoot = null;

    this.init();
  }

  get cssNamespace() {
    return `.${DECHART_CLASS_NAME}.${this.chartType}`;
  }

  get pureWidth() {
    return this.options.width
      - this.options.marginLeft
      - this.options.marginRight;
  }

  get pureHeight() {
    return this.options.height
      - this.options.marginTop
      - this.options.marginBottom
      - this.options.legendHeight;
  }

  static requireNonEmpty(obj, objName?: string) {
    const errorMessage = `Dechart needs ${objName}`;
    if (obj === undefined || obj === null) throw new Error(errorMessage);
    if (obj.length && obj.length === 0) throw new Error(errorMessage);
    return obj;
  }

  static requireNode(selector, parent = d3) {
    const node = parent.select(selector);
    if (!node || node.empty()) {
      throw new Error(`Dechart needs a html node: ${selector}`);
    }
    return node;
  }

  hasDrawableData() {
    throw new Error('Dechart needs hasDrawableData()');
  }

  init() {
    this.log();

    this.$chartRoot = DechartBase.requireNode(`#${this.componentId}`);
    const svgRoot = this.$chartRoot.select(`.${SVG_ROOT}`);
    this.$svgRoot = svgRoot.empty() 
      ? this.$chartRoot.append('svg').attr('class', SVG_ROOT)
      : svgRoot;
    this.$htmlRoot = DechartBase.requireNode(`.${HTML_ROOT}`, this.$chartRoot);
  }

  attachEventHandlers() {}

  clearSvgRoot() {
    this.$svgRoot.selectAll('*').remove();
  }

  emit(eventName, payload) {
    DechartBase.requireNonEmpty(eventName);
    const subscribers = this.eventHandlers[eventName] || [];
    subscribers.map && subscribers.map((s) => s(payload));
  } 

  globalStyle() {
    // Global style should be inserted only once
    if (state.styles['global'] !== undefined) {
      return '';
    }

    state.styles['global'] = true;
    const ns = '.' + DECHART_CLASS_NAME;
    return `
      ${ns} .axis line, .axis path {
        stroke: #323232;
      }

      ${ns} .axis text {
        fill: #323232;
        font-size: 11px;
      }

      ${ns} .grid line {
        stroke: #dfe1e5;
      }

      ${ns} .legendWrapper {
        align-items: center;
        display: flex;
        font-size: 11px;
        justify-content: left;
        margin-bottom: 10px;
        margin-top: 20px;
        line-height: 16px;
      }

      ${ns} .legendWrapper > div {
        margin-left: 20px;        
      }

      ${ns} .legendWrapper .group {
        cursor: pointer;
        display: inline-block;
        margin-right: 20px;
      }

      ${ns} .legendWrapper .group.active {
        font-weight: 600;
      }

      ${ns} .legendWrapper .group:hover {
        color: #111;
      }

      ${ns} .legendWrapper .group > p {
        display: inline-block;
      }
      
      ${ns} .legendWrapper .colorBox {
        border-radius: 2px;
        height: 6px;
        margin-right: 6px;
        width: 20px;
      }

      ${ns} .hide {
        display: none;
      }
    `;
  }

  handleClickLegendEntry(d, idx, elem) {
    let selectedData = undefined;
    const activeIndex = elem[idx].className.indexOf(' active');

    if (activeIndex === -1) {
      elem.map((e, i) => {
        e.className = i === idx ? elem[i].className + ' active' : 'group';
      });
      selectedData = {
        ...this.data,
        chunks: [
          { ...this.data.chunks[idx] },
        ],
      };
    } else {
      elem[idx].className = 'group';
      selectedData = this.data;
    }
  }

  injectStyle() {
    document.getElementById(this.componentId).className += ` ${DECHART_CLASS_NAME} ${this.chartType}`;

    // inject only once
    if (state.styles[this.chartType] !== undefined) return;

    const head = document.head || document.getElementsByTagName('head')[0];
    const styleNode = document.createElement('style');
    styleNode.type = 'text/css';
    const style = this.globalStyle() + this.style();

    if (style.length > 0) {
      if (styleNode['styleSheet']) {
        styleNode['styleSheet'].cssText = style;
      } else {
        styleNode.appendChild(document.createTextNode(style));
      }
      head.appendChild(styleNode);
      state.styles[this.chartType] = true;
    }
  }

  log() {
    console.debug(this.chartType, this.componentId, this.options, this.data);
  }

  on(eventName, handler) {
    DechartBase.requireNonEmpty(eventName);
    pushToObject(this.eventHandlers, eventName, handler);
    return this;
  }

  renderLegend(data) {
    if (!data.keys) return;
    this.$htmlRoot.select('.legendWrapper').remove();
    const keys = Object.values(data.keys);
    const legend = this.$htmlRoot.append('div')
      .attr('class', 'legendWrapper')
      .style('height', this.options.legendHeight)
      .append('div')
      .attr('class', 'inner');

    const legendEntry = legend.selectAll('.legendWrapper')
      .data(keys)
      .enter()
      .append('div')
      .attr('class', 'group')
      .on('click', this.handleClickLegendEntry.bind(this));

    legendEntry.append('p')
      .attr('class', 'colorBox')
      .style('background-color', (d) => d.color);

    legendEntry.append('p')
      .attr('class', 'text')
      .text((d) => d.label);
  }

  renderProxy() {
    try {
      this.clearSvgRoot();
      this.injectStyle();
      this.setBoundingRectSize();
      const rendered = this.render();
      !!rendered && this.attachEventHandlers();
    } catch (err) {
      console.error(err);
    }
  }

  setBoundingRectSize() {
    this.options.height = this.options.height
      ? this.options.height
      : document.getElementById(this.componentId).offsetHeight;

    this.options.width = this.options.width
      ? this.options.width
      : document.getElementById(this.componentId).offsetWidth;
  }

  style() {
    console.error('Dechart needs style()');
  }

  beta__dispatch(action: object) {
    /**
     * Temporary implementation. 
     */
    console.log('[dechart] dispatch() with action: %o', action, this.componentId);
    const element = document.getElementById(this.componentId);
    console.log('on element', element);
    element && (element.style.backgroundColor = '#f7f2e9');
  }

  render() {
    console.error('Dechart needs to define render()');
    return false;
  }
}

interface EventHandlers {
  [eventType: string]: Array<Function>;
}

interface ChartOptions {
  backgroundColor: string;
  height: number;
  legendHeight: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  width: number;
}
