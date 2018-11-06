"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SyntheticEvent;

function SyntheticEvent() {
  var bulbX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var bulbY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var clientX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var clientY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var selectedData = arguments.length > 4 ? arguments[4] : undefined;
  var xIdx = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  this.bulbX = bulbX;
  this.bulbY = bulbY;
  this.clientX = clientX;
  this.clientY = clientY;
  this.selectedData = selectedData;
  this.xIdx = xIdx;
}
//# sourceMappingURL=SyntheticEvent.js.map
