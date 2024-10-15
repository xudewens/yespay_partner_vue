// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
// 金额显示2位小数
function toThousandFilter(num) {
  // return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  return (+num || 0).toFixed(2).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
export {
  toThousandFilter //   通过此处导出方法
}

// 金额显示8位小数
function digitalThousandFilter(num) {
  const decimalIndex = num.toString().indexOf('.')
  if (decimalIndex !== -1) {
    const formatPart = num.toString().substring(0, decimalIndex) // 整数部分所有数字
    const decimalPart = num.toString().substring(decimalIndex + 1) // 小数部分的所有数字
    const formattedNumber = formatPart.toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ',')) + '.' + decimalPart
    return formattedNumber
  } else {
    return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  }
}
export {
  digitalThousandFilter //   通过此处导出方法
}

/**
 * 1.0000 => "1.000"
 * @param {number} num
 */
// 金额显示3位小数
function toThousandFilterThree(num) {
  return (+num || 0).toFixed(3).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
export {
  toThousandFilterThree //   通过此处导出方法
}

// 金额带位分号
function toThousand(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
export {
  toThousand //   通过此处导出方法
}

// 金额带位分号 -有小数显示小数，没小数保留两位
function numEight(num) {
  const str = String(num)
  const newStr = str.split('.')
  if (newStr[1]) { // 有小数
    return num.toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  } else {
    return (+num || 0).toFixed(2).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  }
}
export {
  numEight //   通过此处导出方法
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function arrayOfObject(inputObject) {
return  Object.entries(inputObject).map(([key, value]) => {
    return { value: key, label: value };
  });
}

export function getPropertyIfExists(obj, propName) {
  if (obj.hasOwnProperty(propName)) {
    return obj[propName];
  } else {
    return ''; // 如果属性不存在，可以根据需求返回其他值，比如 undefined 或者一个默认值
  }
}


export function arraysHaveSameElements(arr1, arr2) {
  if (arr1.length !== arr2.length) {
      return false;
  }

  const frequencyCounter1 = {};
  const frequencyCounter2 = {};

  for (let val of arr1) {
      frequencyCounter1[val] = (frequencyCounter1[val] || 0) + 1;
  }

  for (let val of arr2) {
      frequencyCounter2[val] = (frequencyCounter2[val] || 0) + 1;
  }

  for (let key in frequencyCounter1) {
      if (!(key in frequencyCounter2)) {
          return false;
      }
      if (frequencyCounter1[key] !== frequencyCounter2[key]) {
          return false;
      }
  }

  return true;
}

export  function  flattenTree(obj) {
  const allIds = [];
  function extractIds(obj) {
      if (obj.id) {
          allIds.push(obj.id);
      }
      if (obj.children && obj.children.length > 0) {
          obj.children.forEach(child => {
              extractIds(child);
          });
      }
  }
  extractIds(obj);
  return allIds;
}