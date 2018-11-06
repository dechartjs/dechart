import AreaChart from './AreaChart/AreaChart';
import BarChart from './BarChart/BarChart';
import LineChart from './LineChart/LineChart';
import PieChart from './PieChart/PieChart';
import StackBarChart from './StackBarChart/StackBarChart';

export const DechartType = {
  AREA: 'AREA',
  BAR: 'BAR',
  LINE: 'LINE',
  PIE: 'PIE',
  STACK: 'STACK',
};

export const CHART_ROOT = 'chartRoot';
export const DECHART_CLASS_NAME = '__dechart__';
export const HTML_ROOT = 'htmlRoot';
export const SVG_ROOT = 'svgRoot';
export const SVG_ROOT_INNER = 'svgRootInner';
export const TOOLTIP_ROOT = 'tooltipRoot';

export default class Dechart {
  constructor({
    chartType,
    componentId,
    data,
    options,
  }) {
    switch (chartType) {
      case DechartType.AREA:
        return new AreaChart(arguments[0]);
      case DechartType.BAR:
        return new BarChart(arguments[0]);
      case DechartType.LINE:
        return new LineChart(arguments[0]);
      case DechartType.PIE:
        return new PieChart(arguments[0]);
      case DechartType.STACK:
        return new StackBarChart(arguments[0]);
      default:
        throw new Error('chart type not specified');
    }
  }
}
