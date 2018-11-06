"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var d3 = _interopRequireWildcard(require("d3"));

var _utils = require("../utils");

var _DechartBase2 = _interopRequireDefault(require("../DechartBase"));

var _lineChartEvents = _interopRequireDefault(require("./lineChartEvents"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var defaultOptions = {
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
  yAxisTicks: 5
};

var LineChart =
/*#__PURE__*/
function (_DechartBase) {
  _inherits(LineChart, _DechartBase);

  function LineChart(_ref) {
    var _this;

    var chartType = _ref.chartType,
        componentId = _ref.componentId,
        data = _ref.data,
        options = _ref.options;

    _classCallCheck(this, LineChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LineChart).call(this, _objectSpread({}, arguments[0], {
      defaultOptions: defaultOptions
    })));
    _this.xScale = null;
    _this.yScale = null;
    _this.yMax = null;
    _this.yMin = null;
    _this.$bulb = null;
    _this.$svgRootInner = null;

    _this.renderProxy();

    return _this;
  }

  _createClass(LineChart, [{
    key: "hasDrawableData",
    value: function hasDrawableData() {
      return this.data.keys && this.data.values && this.data.values.length > 0;
    }
  }, {
    key: "preprocess",
    value: function preprocess() {
      var data = _objectSpread({}, this.data);

      data.values = _toConsumableArray(this.data.values);
      data.values.map(function (d) {
        d.date = d3.isoParse(d.date);
      });
      data.values.sort(function (x, y) {
        return x.date - y.date;
      });
      this.data = data;
    }
  }, {
    key: "style",
    value: function style() {
      var ns = this.cssNamespace;
      return "\n      ".concat(ns, " .area {\n        fill: blue;\n      }\n\n      ").concat(ns, " .grid path {\n        stroke: transparent;\n      }\n\n      ").concat(ns, " .grid line {\n        stroke: #dfe1e5;\n      }\n\n      ").concat(ns, " .line {\n        fill: none;\n        stroke-width: 2px;\n      }\n\n      ").concat(ns, " .focus circle {\n        fill: none;\n        stroke: #808080;\n        stroke-width: 1px;\n      }\n\n      ").concat(ns, " .hover-line {\n        stroke: #808080;\n        stroke-width: 2px;\n        stroke-dasharray: 3,3;\n      }\n\n      ").concat(ns, " .axis-x .domain {\n        stroke: #cccccc;\n      }\n\n      ").concat(ns, " .axis-y .domain {\n        stroke: transparent;\n      }\n\n      ").concat(ns, " .axis text {\n        fill: #727a77;\n        text-anchor: start;\n      }\n      \n      ").concat(ns, " .axis line {\n        stroke: #cccccc;\n      }\n\n      ").concat(ns, " .tick {\n        font-size: 12px;\n      }\n\n      ").concat(ns, " .legendWrapper .colorBox {\n        height: 2px;\n        margin-bottom: 3px;\n        margin-right: 6px;\n        width: 20px;\n      }\n    ");
    }
  }, {
    key: "renderBulb",
    value: function renderBulb() {
      this.$bulb = this.$svgRootInner.append('g').attr('class', 'focus').style('display', 'none');
      this.$bulb.append("line").attr('class', 'x-hover-line hover-line').attr('y1', 0).attr('y2', 0);
      this.$bulb.append("line").attr('class', 'y-hover-line hover-line').attr('x1', 0).attr('x2', 0); // this.$bulb.append('circle')
      //   .attr('class', 'circle')
      //   .attr('r', 3.5);
    }
  }, {
    key: "renderGrid",
    value: function renderGrid() {
      var yGrid = d3.axisLeft(this.yScale).tickFormat('').tickValues((0, _utils.createEvenlySpacedArray)(this.yMin, this.yMax, this.options.yAxisTicks)).tickSize(-this.pureWidth);
      this.$svgRootInner.append('g').attr('class', 'grid').call(yGrid);
    }
  }, {
    key: "renderRoot",
    value: function renderRoot() {
      if (!this.hasDrawableData()) {
        return false;
      }

      var data = this.data;
      this.yMax = (0, _utils.normalizeMaxValue)(d3.max(data.values, function (v) {
        return (0, _utils.pick)(function (curr, prev) {
          return curr > prev;
        }, v, Object.keys(data.keys));
      }));
      this.yMin = d3.min(data.values, function (v) {
        return (0, _utils.pick)(function (curr, prev) {
          return curr < prev;
        }, v, Object.keys(data.keys));
      });

      if (this.yMax === this.yMin) {
        this.yMin = this.yMin / 2.0;
        this.yMax = this.yMax + this.yMin;
      }

      this.xScale = d3.scaleTime().domain(d3.extent(data.values, function (v) {
        return v.date;
      })).range([this.options.inChartLeftMargin, this.pureWidth - this.options.inChartRightMargin]);
      this.yScale = d3.scaleLinear().domain([this.options.minYScale ? this.yMin : 0, this.yMax]).range([this.pureHeight, 0]);
      this.$svgRoot.attr("width", this.options.width).attr("height", this.options.height - this.options.legendHeight);
      this.$svgRootInner = this.$svgRoot.append('g').attr('class', 'svgRootInner').attr('transform', "translate(\n        ".concat(this.options.marginLeft, ",\n        ").concat(this.options.marginTop, ")"));
      this.options.showGrid && this.renderGrid();
      this.renderLine();
      this.options.showXAxis && this.renderXAxis();
      this.options.showYAxis && this.renderYAxis();
      this.options.showBulb && this.renderBulb();
      this.options.showLegend && this.renderLegend(data);
      return true;
    }
  }, {
    key: "renderLine",
    value: function renderLine() {
      var _this2 = this;

      var makeLine = function makeLine() {
        var xKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'date';
        var yKey = arguments.length > 1 ? arguments[1] : undefined;

        if (yKey === undefined) {
          throw new Error('LineChart needs yKey to make lines');
        }

        return d3.line().x(function (d) {
          return _this2.xScale(d[xKey]);
        }).y(function (d) {
          return _this2.yScale(d[yKey]);
        });
      };

      var data = this.data;
      var chunk = this.$svgRootInner.selectAll('.chunk').data([data]).enter();

      var _loop = function _loop(key) {
        chunk.append('g').attr('class', 'chunk').append('path').attr('class', 'line').attr('d', function (d) {
          return makeLine('date', key)(d.values);
        }).attr('stroke', function (d) {
          return d.keys[key].color;
        });
      };

      for (var key in data.keys) {
        _loop(key);
      }
    }
  }, {
    key: "renderXAxis",
    value: function renderXAxis() {
      var xAxis = d3.axisBottom(this.xScale).tickFormat(function (date) {
        return (0, _utils.getFormattedDate)(date);
      });
      this.options.xAxisTicks > 0 && xAxis.ticks(this.options.xAxisTicks);
      var tickXAxis = this.$svgRootInner.append("g").attr('class', 'axis axis-x').attr("transform", "translate(0," + this.pureHeight + ")").call(xAxis);
      tickXAxis.selectAll('path').style('display', 'none');
      tickXAxis.selectAll('line').attr('class', function (date) {
        return (0, _utils.isMidnight)(date) ? '' : 'hide';
      });
      tickXAxis.selectAll('text').call((0, _utils.makeWrap)(3)).attr('dx', '0em').attr('dy', '9px').attr('font-size', this.options.xAxisFontSize);
    }
  }, {
    key: "renderYAxis",
    value: function renderYAxis() {
      var yAxis = d3.axisLeft(this.yScale).tickValues((0, _utils.createEvenlySpacedArray)(this.yMin, this.yMax, this.options.yAxisTicks)).tickFormat(function (d, i) {
        return (0, _utils.abbrNum)(d, 1);
      });
      var tickYAxis = this.$svgRootInner.append("g").attr('class', 'axis axis-y').call(yAxis);
      tickYAxis.selectAll('line').attr('display', 'none');
      tickYAxis.selectAll('text').attr('x', '0').attr('dy', '1.2em').attr('text-anchor', 'start').attr('font-size', this.options.yAxisFontSize);
    }
  }, {
    key: "render",
    value: function render() {
      if (this.hasDrawableData()) {
        this.preprocess();
        return this.renderRoot();
      }
    }
  }]);

  return LineChart;
}(_DechartBase2.default);

;

var _default = (0, _utils.compose)(_lineChartEvents.default)(LineChart);

exports.default = _default;
//# sourceMappingURL=LineChart.js.map
