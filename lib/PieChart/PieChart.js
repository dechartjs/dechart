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
  height: 232,
  legendHeight: 36,
  showLegend: true
};

var PieChart =
/*#__PURE__*/
function (_DechartBase) {
  _inherits(PieChart, _DechartBase);

  function PieChart(_ref) {
    var _this;

    var chartType = _ref.chartType,
        componentId = _ref.componentId,
        data = _ref.data,
        options = _ref.options;

    _classCallCheck(this, PieChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PieChart).call(this, _objectSpread({}, arguments[0], {
      defaultOptions: defaultOptions
    })));

    _this.renderProxy();

    return _this;
  }

  _createClass(PieChart, [{
    key: "hasDrawableData",
    value: function hasDrawableData() {
      return (this.data.values || []).length > 0;
    }
  }, {
    key: "style",
    value: function style() {
      var ns = this.cssNamespace;
      return "\n      ".concat(ns, " path.slice {\n        stroke: #fff;\n      }\n\n      ").concat(ns, " polyline {\n        opacity: .3;\n        stroke: black;\n        stroke-width: 1px;\n        fill: none;\n      }\n\n      ").concat(ns, " .labelValue {\n        font-size: 60%;\n        opacity: .5;\n      }\n\n      ").concat(ns, " .toolTip {\n        position: absolute;\n        display: none;\n        width: auto;\n        height: auto;\n        background: none repeat scroll 0 0 white;\n        border: 0 none;\n        border-radius: 8px 8px 8px 8px;\n        box-shadow: -3px 3px 15px #888888;\n        color: black;\n        font: 12px sans-serif;\n        padding: 5px;\n        text-align: center;\n      }\n\n      ").concat(ns, " text {\n        fill: #ffffff;\n        font: 12px SpoqaHanSans;\n        font-weight: 100;\n      }\n    ");
    }
  }, {
    key: "renderRoot",
    value: function renderRoot() {
      var _this2 = this;

      var data = this.data;
      var _this$options = this.options,
          height = _this$options.height,
          width = _this$options.width,
          legendHeight = _this$options.legendHeight;
      var margin = {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
      };
      var pureHeight = height - legendHeight - margin.top - margin.bottom;
      var pureWidth = width - margin.left - margin.right;
      var radius = Math.min(width, height) / 2;
      var color = d3.scaleOrdinal(d3.schemeCategory20);
      this.$svgRoot.style('height', height - legendHeight).style('width', width);
      var g = this.$svgRoot.append('g').attr('class', 'g-wrapper').append('g');
      g.append('g').attr('class', 'slices');
      g.append('g').attr('class', 'labelName');
      g.append('g').attr('class', 'labelValue');
      g.append('g').attr('class', 'lines');
      g.attr('transform', 'translate(' + pureWidth / 2 + ',' + pureHeight / 2 + ')');
      var pie = d3.pie().sort(null).value(function (d) {
        return d.value;
      });
      var arc = d3.arc().innerRadius(radius * 0.50).outerRadius(radius * 0.75);
      var outerArc = d3.arc().innerRadius(radius * 0.62).outerRadius(radius * 0.62);
      var toolTip = this.$htmlRoot.append('div').attr('class', 'toolTip');
      this.options.showLegend && this.renderLegend(data);
      var slice = g.select('.slices').selectAll('path.slice').data(pie(data.values));
      slice.enter().insert('path').style('fill', function (d, i) {
        return data.keys[data.values[i].key] ? data.keys[data.values[i].key].color : color(i);
      }).style('opacity', 0.9).attr('class', 'slice').merge(slice).transition().duration(1000).attrTween('d', function (d) {
        _this2._current = _this2._current || d;
        var interpolate = d3.interpolate(_this2._current, d);
        _this2._current = interpolate(0);
        return function (t) {
          return arc(interpolate(t));
        };
      });
      g.select('.slices').selectAll('path.slice').on('mousemove', function (d) {
        toolTip.style('left', d3.event.clientX + 10 + 'px');
        toolTip.style('top', d3.event.clientY - 25 + 'px');
        toolTip.style('display', 'inline-block');
        toolTip.style('position', 'fixed');
        toolTip.html(d.data.key + '<br>' + Math.floor(d.data.value * 100) / 100);
      }).on('mouseout', function (d) {
        return toolTip.style('display', 'none');
      });
      slice.exit().remove();
      var text = g.select('.labelName').selectAll('text').data(pie(data.values), function (d) {
        return d.data.key;
      });
      text.enter().append('text').attr('style', 'text-anchor: middle;').attr('dy', '.35em').text(function (d) {
        if (d.endAngle - d.startAngle >= 0.2) {
          return "".concat(Math.floor(d.data.ratio), "%");
        }

        return '';
      }).merge(text).transition().duration(1000).attrTween('transform', function (d) {
        _this2._current = _this2._current || d;
        var interpolate = d3.interpolate(_this2._current, d);
        _this2._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          return 'translate(' + pos + ')';
        };
      });
      text.exit().remove();
    }
  }, {
    key: "render",
    value: function render(data) {
      this.renderRoot(data);
    }
  }]);

  return PieChart;
}(_DechartBase2.default);

exports.default = PieChart;
//# sourceMappingURL=PieChart.js.map
