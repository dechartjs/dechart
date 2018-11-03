import * as d3 from 'd3';

// https://github.com/reduxjs/redux/blob/master/src/compose.js
export function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

export function makeBisector(key = 'date') {
  return d3.bisector((d) => d[key]).left;
}

export function pushToObject(obj, key, elem) {
  if (!obj) throw new Error(`cannot add ${key}`);

  if (obj[key] === undefined || !Array.isArray(obj[key])) {
    obj[key] = [ elem ];
  } else {
    obj[key].push(elem);
  }
}

export function valueSum(obj, excludeKey = 'date') {
  return Object.keys(obj)
    .filter((key) => key !== excludeKey)
    .reduce((acc, curr) => {
      return acc + +obj[curr];
    }, 0);
}

export function abbrNum(value, upperCase = false) {
  let newValue = value;
  if (value >= 1000) {
    const suffixes = [ '', 'k', 'm', 'b', 't' ];
    const suffixNum = Math.floor(('' + value).length / 3);
    let shortValue = '';
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat((suffixNum != 0
        ? (value / Math.pow(1000, suffixNum))
        : value).toPrecision(precision));
      const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue
      + (upperCase ? suffixes[suffixNum].toUpperCase() : suffixes[suffixNum]);
  }
  return newValue;
}

export function pick(comparator, obj, includeKeys = []) {
  let val = 0;
  for (const key in obj) {
    if (includeKeys.includes(key)) {
      val = comparator(+obj[key], +val) ? +obj[key] : +val;
    }
  }
  return val;
}

export function createEvenlySpacedArray(min, max, numOfSplits) {
  return Array.from(
    new Array(numOfSplits + 1),
    (val, index) => min + index * (max - min) / numOfSplits,
  );
}

// 31 => 40, 999 => 1000, 10000 => 20000
export function normalizeMaxValue(dataMax = 0) {
  const defaultMax = 10;
  const dataMaxAbs = Math.abs(dataMax);

  if (dataMaxAbs < defaultMax) {
    return dataMax >= 0 ? defaultMax : defaultMax * -1;
  }
  const flooredNum = Math.pow(10, Math.trunc(dataMaxAbs).toString().length - 1);
  const normalizedMax = Math.trunc(dataMaxAbs / flooredNum) * flooredNum + flooredNum;
  return dataMax >= 0 ? normalizedMax : normalizedMax * -1;
}

const FULL_YEAR_PLACEHOLDER = '%Y';
const DATE_PLACEHOLDER = '%d';
const MONTH_PLACEHOLDER = '%m';
const MONTH_NAME_PLACEHOLDER = '%b';
const HOUR_PLACEHOLDER = '%H';

export function isMidnight(date) {
  return d3.timeFormat(HOUR_PLACEHOLDER)(date) === '00';
}

export function getFormattedDate(date) {
  if (!isMidnight(date)) {
    return '';
  }
  const month = d3.timeFormat(MONTH_PLACEHOLDER)(date);
  const day = d3.timeFormat(DATE_PLACEHOLDER)(date);
  let format = '';
  if (month === '01' && day === '01') {
    format = `${MONTH_NAME_PLACEHOLDER}\n${FULL_YEAR_PLACEHOLDER}`;
  } else if (day === '01') {
    format = MONTH_NAME_PLACEHOLDER;
  } else {
    format = DATE_PLACEHOLDER;
  }
  return d3.timeFormat(format)(date);
}

export function makeWrap(maxLineCount = 1) {
  return function replaceNewlineCharacters(text) {
    text.each(function () {
      const textElement = d3.select(this);
      const words = textElement.text().split(/\n+/);
      textElement.text('');

      for (const word of words.slice(0, maxLineCount)) {
        textElement.append('tspan')
          .attr('x', 0)
          .attr('dy', '1em')
          .text(word);
      }
    });
  };
}

const longMonthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const shortMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getMonthName(date, long = true) {
  if (!(date instanceof Date)) {
    return null;
  }

  const month = date.getMonth();
  if (month < 0 || month > 11) {
    return null;
  }

  return long ? longMonthNames[month] : shortMonthNames[month];
}
