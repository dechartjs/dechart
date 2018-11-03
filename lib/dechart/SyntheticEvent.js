"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SyntheticEvent;

function SyntheticEvent(_ref) {
  var _ref$bulbX = _ref.bulbX,
      bulbX = _ref$bulbX === void 0 ? [] : _ref$bulbX,
      _ref$bulbY = _ref.bulbY,
      bulbY = _ref$bulbY === void 0 ? [] : _ref$bulbY,
      _ref$clientX = _ref.clientX,
      clientX = _ref$clientX === void 0 ? 0 : _ref$clientX,
      _ref$clientY = _ref.clientY,
      clientY = _ref$clientY === void 0 ? 0 : _ref$clientY,
      selectedData = _ref.selectedData,
      _ref$xIdx = _ref.xIdx,
      xIdx = _ref$xIdx === void 0 ? 0 : _ref$xIdx;
  this.bulbX = bulbX;
  this.bulbY = bulbY;
  this.clientX = clientX;
  this.clientY = clientY;
  this.selectedData = selectedData;
  this.xIdx = xIdx;
}