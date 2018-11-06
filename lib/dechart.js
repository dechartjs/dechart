"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TOOLTIP_ROOT = exports.SVG_ROOT_INNER = exports.SVG_ROOT = exports.HTML_ROOT = exports.DECHART_CLASS_NAME = exports.CHART_ROOT = exports.DechartType = void 0;

var _AreaChart = _interopRequireDefault(require("./AreaChart/AreaChart"));

var _BarChart = _interopRequireDefault(require("./BarChart/BarChart"));

var _LineChart = _interopRequireDefault(require("./LineChart/LineChart"));

var _PieChart = _interopRequireDefault(require("./PieChart/PieChart"));

var _StackBarChart = _interopRequireDefault(require("./StackBarChart/StackBarChart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DechartType = {
  AREA: 'AREA',
  BAR: 'BAR',
  LINE: 'LINE',
  PIE: 'PIE',
  STACK: 'STACK'
};
exports.DechartType = DechartType;
var CHART_ROOT = 'chartRoot';
exports.CHART_ROOT = CHART_ROOT;
var DECHART_CLASS_NAME = '__dechart__';
exports.DECHART_CLASS_NAME = DECHART_CLASS_NAME;
var HTML_ROOT = 'htmlRoot';
exports.HTML_ROOT = HTML_ROOT;
var SVG_ROOT = 'svgRoot';
exports.SVG_ROOT = SVG_ROOT;
var SVG_ROOT_INNER = 'svgRootInner';
exports.SVG_ROOT_INNER = SVG_ROOT_INNER;
var TOOLTIP_ROOT = 'tooltipRoot';
exports.TOOLTIP_ROOT = TOOLTIP_ROOT;

var Dechart = function Dechart(_ref) {
  var chartType = _ref.chartType,
      componentId = _ref.componentId,
      data = _ref.data,
      options = _ref.options;

  _classCallCheck(this, Dechart);

  switch (chartType) {
    case DechartType.AREA:
      return new _AreaChart.default(arguments[0]);

    case DechartType.BAR:
      return new _BarChart.default(arguments[0]);

    case DechartType.LINE:
      return new _LineChart.default(arguments[0]);

    case DechartType.PIE:
      return new _PieChart.default(arguments[0]);

    case DechartType.STACK:
      return new _StackBarChart.default(arguments[0]);

    default:
      throw new Error('chart type not specified');
  }
};

exports.default = Dechart;
//# sourceMappingURL=dechart.js.map
