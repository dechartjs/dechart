"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var d3 = _interopRequireWildcard(require("d3"));

var _BarChartEvents = _interopRequireDefault(require("./BarChartEvents"));

var _DechartBase2 = _interopRequireDefault(require("../DechartBase"));

var _dechart = require("../dechart");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var defaultOptions = {
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
  yAxisTicks: 5
};

var BarChart =
/*#__PURE__*/
function (_DechartBase) {
  _inherits(BarChart, _DechartBase);

  function BarChart(_ref) {
    var _this;

    var chartType = _ref.chartType,
        componentId = _ref.componentId,
        data = _ref.data,
        options = _ref.options;

    _classCallCheck(this, BarChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BarChart).call(this, {
      chartType: chartType,
      componentId: componentId,
      data: data,
      defaultOptions: defaultOptions,
      options: options
    }));
    _this.xScale = null;
    _this.yScale = null;
    _this.yMax = null;
    _this.yMin = null;
    _this.$svgRootInner = null;

    _this.renderProxy();

    return _this;
  }

  _createClass(BarChart, [{
    key: "hasDrawableData",
    value: function hasDrawableData() {
      var data = this.data,
          options = this.options;
      return data != null && data.values != null && data.values.length > 0 && (data.keys || options.selectedSeries);
    }
  }, {
    key: "preprocess",
    value: function preprocess() {
      var data = this.data,
          options = this.options;
      var keys = data.keys,
          values = data.values;

      var sortedData = _toConsumableArray(values).sort(function (value1, value2) {
        var date1 = new Date(value1.date);
        var date2 = new Date(value2.date);

        if (date1 > date2) {
          return 1;
        } else if (date1 < date2) {
          return -1;
        } else {
          return 0;
        }
      });

      var processedData = [];
      sortedData.forEach(function (d) {
        processedData.push({
          key: d3.isoParse(d.date),
          value: keys ? +d[Object.keys(keys)[0]] : +d[options.selectedSeries]
        });
      });
      this.data = processedData;
      var _this$options = this.options,
          xAxisTicks = _this$options.xAxisTicks,
          barWidth = _this$options.barWidth,
          marginLeft = _this$options.marginLeft,
          marginRight = _this$options.marginRight,
          paddingLeft = _this$options.paddingLeft,
          paddingRight = _this$options.paddingRight,
          width = _this$options.width;

      if (barWidth && !width) {
        this.options.width = (xAxisTicks + barWidth) * processedData.length + paddingLeft + paddingRight + marginLeft + marginRight;
      } else if (!barWidth && width) {
        this.options.barWidth = (width - paddingLeft - paddingRight) / processedData.length - xAxisTicks;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var willDraw = this.hasDrawableData();

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
  }, {
    key: "renderBars",
    value: function renderBars() {
      var data = this.data,
          options = this.options,
          pureHeight = this.pureHeight,
          xScale = this.xScale,
          yScale = this.yScale,
          rootInner = this.$svgRootInner;
      var bars = rootInner.selectAll('.chunk').data(data);
      bars.enter().append('rect').attr('class', 'bar').attr('x', function (d) {
        return xScale(d.key);
      }).attr('y', function (d) {
        return yScale(d.value);
      }).attr('height', function (d) {
        return pureHeight - yScale(d.value);
      }).attr('width', options.barWidth);
      bars.attr('x', function (d) {
        return xScale(d.key);
      }).attr('y', function (d) {
        return yScale(d.value);
      }).attr('height', function (d) {
        return pureHeight - yScale(d.value);
      }).attr('width', options.barWidth);
      bars.exit().remove();
    }
  }, {
    key: "renderGrid",
    value: function renderGrid() {
      var options = this.options,
          pureWidth = this.pureWidth,
          yMax = this.yMax,
          yMin = this.yMin,
          yScale = this.yScale,
          rootInner = this.$svgRootInner;
      var yGrid = d3.axisLeft(yScale).tickFormat('').tickValues((0, _utils.createEvenlySpacedArray)(yMin, yMax, options.yAxisTicks)).tickSize(-pureWidth);
      rootInner.append('g').attr('class', 'grid').call(yGrid);
      rootInner.selectAll('.grid').select('line').attr('data-dechart-className', 'first-grid-line');
    }
  }, {
    key: "renderRoot",
    value: function renderRoot() {
      var data = this.data,
          options = this.options,
          pureHeight = this.pureHeight,
          pureWidth = this.pureWidth,
          svgRoot = this.$svgRoot;
      svgRoot.style('background-color', options.backgroundColor).style('height', options.height - options.legendHeight).style('width', options.width);
      this.$svgRootInner = svgRoot.append('g').attr('class', _dechart.SVG_ROOT_INNER).attr('transform', "translate(".concat(options.marginLeft, ", ").concat(options.marginTop, ")"));
      this.yMax = (0, _utils.normalizeMaxValue)(d3.max(data, function (d) {
        return (0, _utils.pick)(function (a, b) {
          return a > b;
        }, d, 'value');
      }));
      this.yMin = d3.min(data, function (d) {
        return (0, _utils.pick)(function (a, b) {
          return a < b;
        }, d, 'value');
      });

      if (this.yMax === this.yMin) {
        this.yMin = this.yMin / 2;
        this.yMax = this.yMax + this.yMin;
      }

      this.xScale = d3.scaleBand().domain(data.map(function (d) {
        return d.key;
      })).range([options.paddingLeft, pureWidth - options.paddingRight]);
      this.yScale = d3.scaleLinear().domain([options.minYScale ? this.yMin : 0, this.yMax]).range([pureHeight, 0]);
    }
  }, {
    key: "renderXAxis",
    value: function renderXAxis() {
      var options = this.options,
          pureHeight = this.pureHeight,
          xScale = this.xScale,
          svgInner = this.$svgRootInner;
      var xAxis = d3.axisBottom(xScale).tickFormat(function (key) {
        return (0, _utils.getMonthName)(key, false);
      }).ticks(options.xAxisTicks);
      var xAxisTicks = svgInner.append('g').attr('class', 'axis axis-x').attr('transform', "translate(0, ".concat(pureHeight, ")")).call(xAxis);
      xAxisTicks.selectAll('path').style('display', 'none');
      xAxisTicks.selectAll('line').attr('class', function (date) {
        return (0, _utils.isMidnight)(date) ? '' : 'hide';
      });
      xAxisTicks.selectAll('text').call((0, _utils.makeWrap)(3)).attr('dx', -0.5 * options.xAxisTicks).attr('dy', '9px').attr('font-size', options.xAxisFontSize);
    }
  }, {
    key: "renderYAxis",
    value: function renderYAxis() {
      var options = this.options,
          yMax = this.yMax,
          yMin = this.yMin,
          yScale = this.yScale,
          svgInner = this.$svgRootInner;
      var yAxis = d3.axisLeft(yScale).tickValues((0, _utils.createEvenlySpacedArray)(yMin, yMax, options.yAxisTicks)).tickFormat(function (d) {
        return (0, _utils.abbrNum)(d, 1);
      });
      var yAxisTicks = svgInner.append('g').attr('class', 'axis axis-y').call(yAxis);
      yAxisTicks.selectAll('line').attr('display', 'none');
      yAxisTicks.selectAll('text').attr('x', '0').attr('dy', '1.2em').attr('text-anchor', 'start').attr('font-size', options.yAxisFontSize);
    }
  }, {
    key: "style",
    value: function style() {
      var ns = this.cssNamespace,
          options = this.options;
      return "\n      ".concat(ns, " .area {\n        fill: blue;\n      }\n\n      ").concat(ns, " .axis {\n        stroke: #cccccc;\n      }\n\n      ").concat(ns, " .axis line {\n        stroke: #cccccc;\n      }\n\n      ").concat(ns, " .axis path {\n        stroke: transparent;\n      }\n\n      ").concat(ns, " .axis text {\n        stroke: transparent;\n        stroke-width: 0px;\n        text-anchore: start;\n      }\n\n      ").concat(ns, " .axis-x {\n        stroke: #cccccc;\n      }\n\n      ").concat(ns, " .axis-x text {\n        fill: ").concat(options.xAxisFontColor, ";\n      }\n\n      ").concat(ns, " .axis-y {\n        stroke: transparent;\n      }\n\n      ").concat(ns, " .axis-y text {\n        fill: ").concat(options.yAxisFontColor, ";        \n      }\n\n      ").concat(ns, " .bar {\n        fill: ").concat(options.barColor, ";\n        stroke-width: 0px;\n      }\n\n      ").concat(ns, " .bar:hover {\n        fill: ").concat(options.barColorHover, ";\n      }\n\n      ").concat(ns, " .domain path {\n        stroke: transparent;\n      }\n\n      ").concat(ns, " .grid line {\n        stroke: ").concat(options.gridColor, ";\n      }\n\n      ").concat(ns, " .grid path {\n        stroke: transparent;\n      }\n    ");
    }
  }]);

  return BarChart;
}(_DechartBase2.default);

var _default = BarChart;
exports.default = _default;
//# sourceMappingURL=BarChart.js.map
