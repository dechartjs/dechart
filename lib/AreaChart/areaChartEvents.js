"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var d3 = _interopRequireWildcard(require("d3"));

var _utils = require("../utils");

var _SyntheticEvent = _interopRequireDefault(require("../SyntheticEvent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _default(AreaChart) {
  AreaChart.prototype.attachEventHandlers = function () {
    var that = this;
    var svgRootInnerNode = that.$svgRootInner && that.$svgRootInner.node();
    that.$svgRoot.on('mouseover', function () {
      that.$bulb.style('display', null);
      that.emit('mouseover', {});
    }).on('mouseout', function () {
      that.$bulb.style('display', 'none');
      that.emit('mouseout', {});
    }).on('mousemove', function () {
      var syntheticEvent = makeSyntheticEvent(that, svgRootInnerNode);
      handleMousemoveForBulb(that, syntheticEvent);
      that.emit('mousemove', syntheticEvent);
    });
  };

  return AreaChart;
}

function makeSyntheticEvent(that, svgRootInnerNode) {
  if (svgRootInnerNode === undefined) return;
  var mouseCoord = d3.mouse(svgRootInnerNode);
  var xVal = that.xScale.invert(mouseCoord[0]);

  var _xIdx = (0, _utils.makeBisector)('date')(that.data.values, xVal);

  var xIdx = _xIdx >= that.data.values.length ? that.data.values.length - 1 : _xIdx;
  var data = that.data.values[xIdx];
  var bulbX = [that.xScale(data.date)];
  var bulbY = [that.yScale((0, _utils.valueSum)(data))];
  return new _SyntheticEvent.default({
    bulbX: bulbX,
    bulbY: bulbY,
    clientX: mouseCoord[0],
    clientY: mouseCoord[1],
    date: data.date,
    data: data,
    xIdx: xIdx
  });
}

function handleMousemoveForBulb(that, syntheticEvent) {
  var bulbX = syntheticEvent.bulbX,
      bulbY = syntheticEvent.bulbY,
      data = syntheticEvent.data;
  that.$bulb.select('.x-hover-line').attr('y2', function (d) {
    return that.yScale(that.yMax - (0, _utils.valueSum)(data));
  });
  that.$bulb.select('.y-hover-line').attr('x2', function (d) {
    return -bulbX[0];
  });
  that.$bulb.attr('transform', function (d) {
    return "translate(".concat(bulbX[0], ", ").concat(bulbY[0], ")");
  });
}
//# sourceMappingURL=areaChartEvents.js.map
