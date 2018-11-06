"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = compose;
exports.makeBisector = makeBisector;
exports.pushToObject = pushToObject;
exports.valueSum = valueSum;
exports.abbrNum = abbrNum;
exports.pick = pick;
exports.createEvenlySpacedArray = createEvenlySpacedArray;
exports.normalizeMaxValue = normalizeMaxValue;
exports.isMidnight = isMidnight;
exports.getFormattedDate = getFormattedDate;
exports.makeWrap = makeWrap;
exports.getMonthName = getMonthName;

var d3 = _interopRequireWildcard(require("d3"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// https://github.com/reduxjs/redux/blob/master/src/compose.js
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

function makeBisector() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'date';
  return d3.bisector(function (d) {
    return d[key];
  }).left;
}

function pushToObject(obj, key, elem) {
  if (!obj) throw new Error("cannot add ".concat(key));

  if (obj[key] === undefined || !Array.isArray(obj[key])) {
    obj[key] = [elem];
  } else {
    obj[key].push(elem);
  }
}

function valueSum(obj) {
  var excludeKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'date';
  return Object.keys(obj).filter(function (key) {
    return key !== excludeKey;
  }).reduce(function (acc, curr) {
    return acc + +obj[curr];
  }, 0);
}

function abbrNum(value) {
  var upperCase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var newValue = value;

  if (value >= 1000) {
    var suffixes = ['', 'k', 'm', 'b', 't'];
    var suffixNum = Math.floor(('' + value).length / 3);
    var shortValue = '';

    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat((suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision));
      var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');

      if (dotLessShortValue.length <= 2) {
        break;
      }
    }

    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + (upperCase ? suffixes[suffixNum].toUpperCase() : suffixes[suffixNum]);
  }

  return newValue;
}

function pick(comparator, obj) {
  var includeKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var val = 0;

  for (var key in obj) {
    if (includeKeys.includes(key)) {
      val = comparator(+obj[key], +val) ? +obj[key] : +val;
    }
  }

  return val;
}

function createEvenlySpacedArray(min, max, numOfSplits) {
  return Array.from(new Array(numOfSplits + 1), function (val, index) {
    return min + index * (max - min) / numOfSplits;
  });
} // 31 => 40, 999 => 1000, 10000 => 20000


function normalizeMaxValue() {
  var dataMax = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var defaultMax = 10;
  var dataMaxAbs = Math.abs(dataMax);

  if (dataMaxAbs < defaultMax) {
    return dataMax >= 0 ? defaultMax : defaultMax * -1;
  }

  var flooredNum = Math.pow(10, Math.trunc(dataMaxAbs).toString().length - 1);
  var normalizedMax = Math.trunc(dataMaxAbs / flooredNum) * flooredNum + flooredNum;
  return dataMax >= 0 ? normalizedMax : normalizedMax * -1;
}

var FULL_YEAR_PLACEHOLDER = '%Y';
var DATE_PLACEHOLDER = '%d';
var MONTH_PLACEHOLDER = '%m';
var MONTH_NAME_PLACEHOLDER = '%b';
var HOUR_PLACEHOLDER = '%H';

function isMidnight(date) {
  return d3.timeFormat(HOUR_PLACEHOLDER)(date) === '00';
}

function getFormattedDate(date) {
  if (!isMidnight(date)) {
    return '';
  }

  var month = d3.timeFormat(MONTH_PLACEHOLDER)(date);
  var day = d3.timeFormat(DATE_PLACEHOLDER)(date);
  var format = '';

  if (month === '01' && day === '01') {
    format = "".concat(MONTH_NAME_PLACEHOLDER, "\n").concat(FULL_YEAR_PLACEHOLDER);
  } else if (day === '01') {
    format = MONTH_NAME_PLACEHOLDER;
  } else {
    format = DATE_PLACEHOLDER;
  }

  return d3.timeFormat(format)(date);
}

function makeWrap() {
  var maxLineCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  return function replaceNewlineCharacters(text) {
    text.each(function () {
      var textElement = d3.select(this);
      var words = textElement.text().split(/\n+/);
      textElement.text('');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = words.slice(0, maxLineCount)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var word = _step.value;
          textElement.append('tspan').attr('x', 0).attr('dy', '1em').text(word);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
  };
}

var longMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getMonthName(date) {
  var long = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (!(date instanceof Date)) {
    return null;
  }

  var month = date.getMonth();

  if (month < 0 || month > 11) {
    return null;
  }

  return long ? longMonthNames[month] : shortMonthNames[month];
}
//# sourceMappingURL=utils.js.map
