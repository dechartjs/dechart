"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var d3 = _interopRequireWildcard(require("d3"));

var _DechartBase2 = _interopRequireDefault(require("../DechartBase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
  yAxisTicks: 0
};

var StackBarChart =
/*#__PURE__*/
function (_DechartBase) {
  _inherits(StackBarChart, _DechartBase);

  function StackBarChart(_ref) {
    var chartType = _ref.chartType,
        componentId = _ref.componentId,
        data = _ref.data,
        options = _ref.options;

    _classCallCheck(this, StackBarChart);

    return _possibleConstructorReturn(this, _getPrototypeOf(StackBarChart).call(this, _objectSpread({}, arguments[0], {
      defaultOptions: defaultOptions
    })));
  }

  _createClass(StackBarChart, [{
    key: "drawGrid",
    value: function drawGrid(g, yScale, pureWidth) {
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
      g.append('g').attr('class', 'grid').call(d3.axisLeft(yScale).tickSize(-pureWidth).tickFormat(''));
    }
  }, {
    key: "drawLegend",
    value: function drawLegend(svg, margin) {
      var _this = this;

      var payload = this.data;
      var pureHeight = this.options.height - margin.top - margin.bottom;
      var legend = svg.append('g').attr('class', 'legend-wrapper').attr('font-family', 'sans-serif').attr('font-size', 10).attr('text-anchor', 'end').selectAll('.legend-wrapper').data(payload.keys).enter().append('g').attr('transform', function (d, i) {
        return "translate(".concat(_this.options.width / 2 + i * 80 - 90, ", ").concat(pureHeight + margin.top + margin.bottom / 2 + 5, ")");
      });
      legend.append('rect').attr('class', 'legend').attr('x', 0).attr('width', function (d, i) {
        return 16;
      }).attr('height', 10).attr('fill', function (d, i) {
        return payload.keys[i].color;
      });
      legend.append('text').attr('x', function (d, i) {
        return 15 + 7 * d.label.length;
      }).attr('y', 8).attr('height', 10).text(function (d) {
        return d.label;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var payload = this.data;
      var _this$options = this.options,
          marginBottom = _this$options.marginBottom,
          marginLeft = _this$options.marginLeft,
          marginRight = _this$options.marginRight,
          marginTop = _this$options.marginTop,
          showGrid = _this$options.showGrid,
          showLegend = _this$options.showLegend,
          xAxisTicks = _this$options.xAxisTicks,
          yAxisTicks = _this$options.yAxisTicks;

      if (!payload || !payload.values) {
        return;
      }

      var series = d3.stack().keys(payload.keys.map(function (key) {
        return key.label;
      }))(payload.values);
      var margin = {
        bottom: marginBottom,
        left: marginLeft,
        right: marginRight,
        top: marginTop
      };
      var pureWidth = this.options.width - margin.left - margin.right;
      var pureHeight = this.options.height - margin.top - margin.bottom;
      var dateExtent = d3.extent(payload.values, function (d) {
        return d.x;
      });
      var startDate = new Date(dateExtent[0]);
      var endDate = new Date(dateExtent[1]);
      endDate.setDate(endDate.getDate() + 1);
      var xScale = d3.scaleTime().domain([startDate, endDate]).rangeRound([5, pureWidth - 25]);
      var minY = this.options.minYScale ? d3.min(series[series.length - 1], function (d) {
        return d[1];
      }) : 0;
      var yScale = d3.scaleLinear().domain([minY, d3.max(series[series.length - 1], function (d) {
        return d[1];
      })]).range([pureHeight, 0]).nice();
      var svg = this.wrap.append('svg').attr('width', this.options.width).attr('height', this.options.height);
      var g = svg.append('g').attr('class', 'graph').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      if (showGrid) {
        this.drawGrid(g, yScale, pureWidth);
      }

      var layer = g.selectAll('.layer').data(series).enter().append('g').attr('class', 'layer').attr('fill', function (d, i) {
        return payload.keys[i].color;
      });
      var rect = layer.selectAll('rect').data(function (d) {
        d.map(function (elem) {
          elem.key = d.key;
        });
        return d;
      }).enter().append('rect').attr('x', function (d) {
        return xScale(new Date(d.data.x));
      }).attr('y', pureHeight).attr('width', function () {
        return 5;
      }).attr('height', 0);
      rect.transition().delay(function (d, i) {
        return i * 10;
      }).attr('y', function (d) {
        return yScale(d[1]);
      }).attr('height', function (d) {
        return yScale(d[0]) - yScale(d[1]);
      });

      if (this.options.showXAxis) {
        var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%y-%m'));

        if (xAxisTicks > 0) {
          xAxis.ticks(xAxisTicks);
        }

        g.append('g').attr('class', 'axis axis-x').attr('transform', 'translate(0,' + pureHeight + ')').call(xAxis).selectAll('text').attr('dy', '9px'); // .attr('transform', 'rotate(-65)');
      }

      if (this.options.showYAxis) {
        var yAxis = d3.axisLeft(yScale);

        if (yAxisTicks > 0) {
          yAxis.ticks(yAxisTicks);
        }

        g.append('g').attr('class', 'axis axis-y').attr('transform', 'translate(0,0)').call(yAxis);

        if (showLegend) {
          this.drawLegend(svg, margin);
        }
      }
    }
  }]);

  return StackBarChart;
}(_DechartBase2.default);

exports.default = StackBarChart;