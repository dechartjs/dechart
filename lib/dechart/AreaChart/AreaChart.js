"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var d3 = _interopRequireWildcard(require("d3"));

var _areaChartEvents = _interopRequireDefault(require("./areaChartEvents"));

var _utils = require("../utils");

var _DechartBase2 = _interopRequireDefault(require("../DechartBase"));

var _dechart = require("../dechart");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultOptions = {
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
  yAxisTicks: 2
};

var setEnclosingPath = function setEnclosingPath(line, stackData, xScale, yScale) {
  return stackData.map(function (data) {
    var top = data.map(function (d, idx) {
      return [xScale(d.data.date), yScale(d[1])];
    });
    var bottom = data.map(function (d, idx) {
      return [xScale(d.data.date), yScale(d[0])];
    }).reverse();
    return _objectSpread({}, data, {
      path: line(top) + line(bottom).replace('M', 'L') + 'Z',
      topPath: line(top)
    });
  });
};

var AreaChart =
/*#__PURE__*/
function (_DechartBase) {
  _inherits(AreaChart, _DechartBase);

  function AreaChart(_ref) {
    var _this;

    var chartType = _ref.chartType,
        componentId = _ref.componentId,
        data = _ref.data,
        options = _ref.options;

    _classCallCheck(this, AreaChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AreaChart).call(this, {
      chartType: chartType,
      componentId: componentId,
      data: data,
      defaultOptions: defaultOptions,
      options: options
    }));
    _this.xScale = null;
    _this.yScale = null;
    _this.yMax = null;
    _this.$browser = null;
    _this.$bulb = null;
    _this.$svgRootInner = null;

    _this.renderProxy();

    return _this;
  }

  _createClass(AreaChart, [{
    key: "hasDrawableData",
    value: function hasDrawableData() {
      return (this.data.values || []).length > 0;
    }
  }, {
    key: "preprocess",
    value: function preprocess() {
      this.data.values.forEach(function (d) {
        d.date = d3.isoParse(d.date);
      });
    }
  }, {
    key: "style",
    value: function style() {
      var ns = this.cssNamespace;
      return "\n      ".concat(ns, " .area {\n        fill: blue;\n      }\n\n      ").concat(ns, " .grid path {\n        stroke: transparent;\n      }\n\n      ").concat(ns, " .grid line {\n        stroke: #dfe1e5;\n      }\n      \n      ").concat(ns, " .line {\n        stroke-width: 1px;\n      }\n      \n      ").concat(ns, " .tick {\n        font-size: 12px;\n      }\n\n      ").concat(ns, " .focus circle {\n        fill: none;\n        stroke: #808080;\n        stroke-width: 1px;\n      }\n      \n      ").concat(ns, " .hover-line {\n        stroke: #808080;\n        stroke-width: 2px;\n        stroke-dasharray: 3,3;\n      }\n    ");
    }
  }, {
    key: "renderBulb",
    value: function renderBulb() {
      this.$bulb = this.$browser.append('g').attr('class', 'focus').style('display', 'none');
      this.$bulb.append('line').attr('class', 'x-hover-line hover-line').attr('y1', 0).attr('y2', 0);
      this.$bulb.append('line').attr('class', 'y-hover-line hover-line').attr('x1', 0).attr('x2', 0);
      this.$bulb.append('circle').attr('class', 'circle').attr('r', 3.5);
    }
  }, {
    key: "renderGrid",
    value: function renderGrid() {
      var yGrid = d3.axisLeft(this.yScale).tickFormat('').tickValues([this.yMax / 2.0, this.yMax]).tickSize(-this.pureWidth);
      var inner = this.$chartRoot.select(".".concat(_dechart.SVG_ROOT, " .").concat(_dechart.SVG_ROOT_INNER));

      if (!inner.empty()) {
        inner.append('g').attr('class', 'grid').call(yGrid);
      }
    }
  }, {
    key: "renderRoot",
    value: function renderRoot() {
      if (!this.hasDrawableData()) return false;
      var data = this.data;
      this.$svgRoot.attr('width', this.options.width).attr('height', this.options.height - this.options.legendHeight);
      this.$svgRootInner = this.$svgRoot.append('g').attr('class', _dechart.SVG_ROOT_INNER).attr('transform', "translate(\n        ".concat(this.options.marginLeft, ",\n        ").concat(this.options.marginTop, ")"));
      this.yMax = d3.max(data.values, function (d) {
        return (0, _utils.valueSum)(d);
      });
      this.yMin = d3.min(data.values, function (d) {
        return (0, _utils.valueSum)(d);
      });
      this.xScale = d3.scaleTime().domain(d3.extent(data.values, function (d) {
        return d.date;
      })).range([0, this.pureWidth]);
      this.yScale = d3.scaleLinear().domain([this.options.minYScale ? this.yMin : 0, this.yMax]).range([this.pureHeight, 0]);
      var line = d3.line().curve(d3.curveMonotoneX);
      var keys = Object.keys(data.keys);
      var stack = d3.stack().keys(keys).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
      var pathEnhancedStack = setEnclosingPath(line, stack(data.values), this.xScale, this.yScale);
      this.$browser = this.$svgRootInner.selectAll('.browser').data(pathEnhancedStack).enter().append('g').attr('class', function (d) {
        return "browser ".concat(d.key);
      });
      this.$browser.append('path').attr('class', 'line').attr('d', function (d) {
        return d.path;
      }).attr('fill', function (d) {
        return data.keys[d.key].color;
      }).style('opacity', this.options.areaOpacity);

      if (this.options.showLinePath) {
        this.$browser.append('path').attr('class', 'line').attr('d', function (d) {
          return d.topPath;
        }).attr('stroke', function (d) {
          return data.keys[d.key].color;
        }).attr('fill', 'transparent');
      }

      this.options.showGrid && this.renderGrid();
      this.options.showXAxis && this.renderXAxis();
      this.options.showYAxis && this.renderYAxis();
      this.options.showBulb && this.renderBulb(data);
      this.options.showLegend && this.renderLegend(data);
      return true;
    }
  }, {
    key: "renderXAxis",
    value: function renderXAxis() {
      var xAxis = d3.axisBottom(this.xScale).tickFormat(d3.timeFormat('%m-%d'));
      this.$svgRootInner.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + this.pureHeight + ')').call(xAxis);
    }
  }, {
    key: "renderYAxis",
    value: function renderYAxis() {
      this.$svgRootInner.append('g').attr('class', 'y axis').call(d3.axisLeft(this.yScale));
    }
  }, {
    key: "render",
    value: function render() {
      this.preprocess();
      return this.renderRoot();
    }
  }]);

  return AreaChart;
}(_DechartBase2.default);

;

var _default = (0, _utils.compose)(_areaChartEvents.default)(AreaChart);

exports.default = _default;