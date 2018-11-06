import AreaChart from './AreaChart/AreaChart';
import BarChart from './BarChart/BarChart';
import DechartBase from './DechartBase';
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

const Dechart = function ({
  chartType,
  componentId,
  data,
  options,
}) {
  try {
    const chart = DechartTypeMapping[chartType];
    chart.call(this, arguments[0]);
  } catch (err) {
    console.error('chart type not specified');
  }
}

export default Dechart;

const DechartTypeMapping = {
  [DechartType.AREA]: AreaChart,
  [DechartType.BAR]: BarChart,
  [DechartType.LINE]: LineChart,
  [DechartType.PIE]: PieChart,
  [DechartType.STACK]: StackBarChart,
};

interface DechartConstructor {
  new (props: {
    chartType,
    componentId,
    data,
    options,
  }): void;
}
