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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _default(LineChart) {
  LineChart.prototype.attachEventHandlers = function () {
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

  return LineChart;
}

function makeSyntheticEvent(that, svgRootInnerNode) {
  if (svgRootInnerNode === undefined) return;

  var _d3$mouse = d3.mouse(svgRootInnerNode),
      _d3$mouse2 = _slicedToArray(_d3$mouse, 2),
      clientX = _d3$mouse2[0],
      clientY = _d3$mouse2[1];

  var keys = Object.keys(that.data.keys);
  var xVal = that.xScale.invert(clientX);

  var _xIdx = (0, _utils.makeBisector)('date')(that.data.values, xVal);

  var xIdx = _xIdx >= that.data.values.length ? that.data.values.length - 1 : _xIdx;
  var selectedData = createSelectedData(that.data.values[xIdx], keys);
  var bulbX = [that.xScale(selectedData.date)];
  var bulbY = getBulbY(that.yScale, selectedData);
  return new _SyntheticEvent.default({
    bulbX: bulbX,
    bulbY: bulbY,
    clientX: clientX,
    clientY: clientY,
    selectedData: selectedData,
    xIdx: xIdx
  });
}

function handleMousemoveForBulb(that, syntheticEvent) {
  var bulbX = syntheticEvent.bulbX;
  that.$bulb.select('.x-hover-line').attr('y2', that.yScale(0)); // that.$bulb.select('.y-hover-line')
  //   .attr('x2', -bulbX);

  that.$bulb.attr('transform', "translate(\n        ".concat(bulbX, ",\n        0\n      )"));
}

function getBulbY(yScale, selectedData) {
  var bulbY = [];

  for (var key in selectedData) {
    key !== 'date' && bulbY.push(yScale(+selectedData[key]));
  }

  return bulbY;
}

function createSelectedData(data, keys) {
  var obj = {};
  keys.forEach(function (key) {
    obj[key] = data[key];
  });
  obj.date = data.date;
  return obj;
}
//# sourceMappingURL=lineChartEvents.js.map
