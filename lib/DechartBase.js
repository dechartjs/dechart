"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var d3 = _interopRequireWildcard(require("d3"));

var _dechart = require("./dechart");

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var state = {
  styles: {}
};

var DechartBase =
/*#__PURE__*/
function () {
  function DechartBase(_ref) {
    var chartType = _ref.chartType,
        componentId = _ref.componentId,
        data = _ref.data,
        defaultOptions = _ref.defaultOptions,
        options = _ref.options;

    _classCallCheck(this, DechartBase);

    this.chartType = DechartBase.requireNonEmpty(chartType);
    this.componentId = DechartBase.requireNonEmpty(componentId, 'componentId');
    this.data = DechartBase.requireNonEmpty(data, 'data');
    this.eventHandlers = {};
    this.options = _objectSpread({}, defaultOptions, options);
    this.$chartRoot = null;
    this.$svgRoot = null;
    this.$htmlRoot = null;
    this.init();
  }

  _createClass(DechartBase, [{
    key: "hasDrawableData",
    value: function hasDrawableData() {
      throw new Error('Dechart needs hasDrawableData()');
    }
  }, {
    key: "init",
    value: function init() {
      this.log();
      this.$chartRoot = DechartBase.requireNode("#".concat(this.componentId));
      var svgRoot = this.$chartRoot.select(".".concat(_dechart.SVG_ROOT));
      this.$svgRoot = svgRoot.empty() ? this.$chartRoot.append('svg').attr('class', _dechart.SVG_ROOT) : svgRoot;
      this.$htmlRoot = DechartBase.requireNode(".".concat(_dechart.HTML_ROOT), this.$chartRoot);
    }
  }, {
    key: "attachEventHandlers",
    value: function attachEventHandlers() {}
  }, {
    key: "clearSvgRoot",
    value: function clearSvgRoot() {
      this.$svgRoot.selectAll('*').remove();
    }
  }, {
    key: "emit",
    value: function emit(eventName, payload) {
      DechartBase.requireNonEmpty(eventName);
      var subscribers = this.eventHandlers[eventName] || {};
      subscribers.map && subscribers.map(function (s) {
        return s(payload);
      });
    }
  }, {
    key: "globalStyle",
    value: function globalStyle() {
      // Global style should be inserted only once
      if (state.styles.global !== undefined) return '';
      state.styles['global'] = true;
      var ns = '.' + this.DECHART_CLASS_NAME;
      return "\n      ".concat(ns, " .axis line, .axis path {\n        stroke: #323232;\n      }\n\n      ").concat(ns, " .axis text {\n        fill: #323232;\n        font-size: 11px;\n      }\n\n      ").concat(ns, " .grid line {\n        stroke: #dfe1e5;\n      }\n\n      ").concat(ns, " .legendWrapper {\n        align-items: center;\n        display: flex;\n        font-size: 11px;\n        justify-content: left;\n        margin-bottom: 10px;\n        margin-top: 20px;\n        line-height: 16px;\n      }\n\n      ").concat(ns, " .legendWrapper > div {\n        margin-left: 20px;        \n      }\n\n      ").concat(ns, " .legendWrapper .group {\n        cursor: pointer;\n        display: inline-block;\n        margin-right: 20px;\n      }\n\n      ").concat(ns, " .legendWrapper .group.active {\n        font-weight: 600;\n      }\n\n      ").concat(ns, " .legendWrapper .group:hover {\n        color: #111;\n      }\n\n      ").concat(ns, " .legendWrapper .group > p {\n        display: inline-block;\n      }\n      \n      ").concat(ns, " .legendWrapper .colorBox {\n        border-radius: 2px;\n        height: 6px;\n        margin-right: 6px;\n        width: 20px;\n      }\n\n      ").concat(ns, " .hide {\n        display: none;\n      }\n    ");
    }
  }, {
    key: "handleClickLegendEntry",
    value: function handleClickLegendEntry(d, idx, elem) {
      var selectedData = undefined;
      var activeIndex = elem[idx].className.indexOf(' active');

      if (activeIndex === -1) {
        elem.map(function (e, i) {
          e.className = i === idx ? elem[i].className + ' active' : 'group';
        });
        selectedData = _objectSpread({}, this.data, {
          chunks: [_objectSpread({}, this.data.chunks[idx])]
        });
      } else {
        elem[idx].className = 'group';
        selectedData = this.data;
      }
    }
  }, {
    key: "injectStyle",
    value: function injectStyle() {
      // Modify className of a target DOM node.
      document.getElementById(this.componentId).className += " ".concat(this.DECHART_CLASS_NAME, " ").concat(this.chartType); // inject only once

      if (state.styles[this.chartType] !== undefined) return;
      var head = document.head || document.getElementsByTagName('head')[0];
      var styleNode = document.createElement('style');
      styleNode.type = 'text/css';
      var style = this.globalStyle() + this.style();

      if (style.length > 0) {
        if (styleNode.styleSheet) {
          styleNode.styleSheet.cssText = style;
        } else {
          styleNode.appendChild(document.createTextNode(style));
        }

        head.appendChild(styleNode);
        state.styles[this.chartType] = true;
      }
    }
  }, {
    key: "log",
    value: function log() {
      console.debug(this.chartType, this.componentId, this.options, this.data);
    }
  }, {
    key: "on",
    value: function on(eventName, handler) {
      DechartBase.requireNonEmpty(eventName);
      (0, _utils.pushToObject)(this.eventHandlers, eventName, handler);
      return this;
    }
  }, {
    key: "renderLegend",
    value: function renderLegend(data) {
      if (!data.keys) return;
      this.$htmlRoot.select('.legendWrapper').remove();
      var keys = Object.values(data.keys);
      var legend = this.$htmlRoot.append('div').attr('class', 'legendWrapper').style('height', this.options.legendHeight).append('div').attr('class', 'inner');
      var legendEntry = legend.selectAll('.legendWrapper').data(keys).enter().append('div').attr('class', 'group').on('click', this.handleClickLegendEntry.bind(this));
      legendEntry.append('p').attr('class', 'colorBox').style('background-color', function (d) {
        return d.color;
      });
      legendEntry.append('p').attr('class', 'text').text(function (d) {
        return d.label;
      });
    }
  }, {
    key: "renderProxy",
    value: function renderProxy() {
      try {
        this.clearSvgRoot();
        this.injectStyle();
        this.setBoundingRectSize();
        var rendered = this.render();
        !!rendered && this.attachEventHandlers();
      } catch (err) {
        console.error(err);
      }
    }
  }, {
    key: "setBoundingRectSize",
    value: function setBoundingRectSize() {
      this.options.height = this.options.height ? this.options.height : document.getElementById(this.componentId).offsetHeight;
      this.options.width = this.options.width ? this.options.width : document.getElementById(this.componentId).offsetWidth;
    }
  }, {
    key: "style",
    value: function style() {
      throw new Error('Dechart needs style()');
    }
    /**
     * todos: dynamic chart update functinality
     */

  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "cssNamespace",
    get: function get() {
      return ".".concat(this.DECHART_CLASS_NAME, ".").concat(this.chartType);
    }
  }, {
    key: "pureWidth",
    get: function get() {
      return this.options.width - this.options.marginLeft - this.options.marginRight;
    }
  }, {
    key: "pureHeight",
    get: function get() {
      return this.options.height - this.options.marginTop - this.options.marginBottom - this.options.legendHeight;
    }
  }], [{
    key: "requireNonEmpty",
    value: function requireNonEmpty(obj, objName) {
      var errorMessage = "Dechart needs ".concat(objName);
      if (obj === undefined || obj === null) throw new Error(errorMessage);
      if (obj.length && obj.length === 0) throw new Error(errorMessage);
      return obj;
    }
  }, {
    key: "requireNode",
    value: function requireNode(selector) {
      var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : d3;
      var node = parent.select(selector);
      if (!node || node.empty()) throw new Error('Dechart needs a html node: %s', selector);
      return node;
    }
  }]);

  return DechartBase;
}();

exports.default = DechartBase;
DechartBase.prototype.DECHART_CLASS_NAME = '__dechart__';
//# sourceMappingURL=DechartBase.js.map
