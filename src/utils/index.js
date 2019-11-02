import Cookies from 'js-cookie'
import moment from 'moment'

const apiHost = 'localhost: 3001'

const isCellPhone = phoneNumber => {
  const myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  return myreg.test(phoneNumber) || false
}

/**
 * @desc 判断是否是正确密码
 * @returns {Boolean}
 * @Params {password}
 * @method isRightPsd(password)
 */
const isRightPsd = password => {
  const myreg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,16}$/
  return myreg.test(password) || false
}

/**
 * @desc 判断是否是符合规则邮箱地址
 * @returns {Boolean}
 * @Params {email}
 * @method isEmail(email)
 */
const isEmail = email => {
  const myreg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
  return myreg.test(email) || false
}

/**
 * @desc 获取地址栏参数
 * @returns {value}
 * @Params {key} req服务端需要
 * @method getQueryString(key)
 */
const queryParam = key => {
  const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`)
  const result = window.location.search.substr(1).match(reg)
  return result ? decodeURIComponent(result[2]) : null
}

/**
 * @desc 格式化时间，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @returns {string}
 * @Params {date, fmt}
 * @method formatTime(time, "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *         formatTime(time, "yyyy.M.d h:m:s.S")      ==> 2006.7.2 8:9:4.18
 */
const formatTime = (date, fmt) => {
  const This = new Date(date)
  const o = {
    'M+': This.getMonth() + 1, // 月份
    'd+': This.getDate(), // 日
    'h+': This.getHours(), // 小时
    'm+': This.getMinutes(), // 分
    's+': This.getSeconds(), // 秒
    'q+': Math.floor((This.getMonth() + 3) / 3), // 季度
    S: This.getMilliseconds(), // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${This.getFullYear()}`).substr(4 - RegExp.$1.length))
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)))
    }
  }
  return fmt
}

/**
 * @desc 格式化时间: 小于1分钟-刚刚, 小于1小时-多少分钟前, 小于1天-多少小时前, 其它-年/月/日
 * @returns {string}
 * @Params {publishTime, requestTime}
 * @method formatPublishTime(publishTime, requestTime)
 */
const formatPublishTime = (publishTime, requestTime) => {
  requestTime = !requestTime ? new Date().getTime() : requestTime
  const limit = parseInt((requestTime - publishTime), 10) / 1000
  let fmt = ''
  if (limit < 60) {
    fmt = '刚刚'
  } else if (limit >= 60 && limit < 3600) {
    fmt = `${Math.floor(limit / 60)}分钟前`
  } else if (limit >= 3600 && limit < 86400) {
    fmt = `${Math.floor(limit / 3600)}小时前`
  } else {
    fmt = formatTime(publishTime, 'MM-dd')
  }
  return fmt
}

/**
 * @desc 数字格式化
 * @returns {string}
 */
const addComma = num => {
  let number = (num || 0).toString()
  let result = ''
  while (number.length > 3) {
    result = `,${number.slice(-3)}${result}`
    number = number.slice(0, number.length - 3)
  }
  if (number) {
    result = number + result
  }
  return result
}
/**
 * @desc 非异步打开新窗口
 * @Params {url}
 * @method openNewWindow(url)
 */
const openNewWindow = url => {
  document.getElementsByTagName('body')[0].append((`<a href="${url}" target="_blank" id="openWin"></a>`))
  document.getElementById('openWin').click()
  document.getElementById('#openWin').remove()
}

/**
 * @desc 数组根据数组对象中的某个属性值进行排序的方法
 * @method myArray.sort(sortBy('number', false, parseFloat)) 表示根据number属性降序排列
 * @param filed 排序的属性-如number属性
 * @param rev true表示升序排列false降序排序
 * @param primer 转换格式的方法
 * */
const sortBy = (filed, rev, primer) => {
  rev = rev ? 1 : -1
  return (a, b) => {
    a = a[filed]
    b = b[filed]
    if (typeof (primer) !== 'undefined') {
      a = primer(a)
      b = primer(b)
    }
    if (a < b) {
      return rev * -1
    }
    if (a > b) {
      return rev * 1
    }
    return 1
  }
}

/**
 * @desc websocket链接
 * @param {args} args = {
 *    url链接的接口路由,
 *    message接收消息的回调函数，返回接收到的消息+此websocket对象,
 *    success链接成功回调函数，返回此websocket对象,
 *    close关闭ws回调函数，返回此websocket对象,
 *    host如果不是默认域名添加此参数可省略,
 *    params发送的参数可省略,
 *    https:true支持https传此参数
 * }
 * @Ruturn {ws} ws: 此websocket对象，用于后续其它操作
 * @method wss(url)
 * */
const websocket = args => new Promise(((resolve, reject) => {
  try {
    const { url, message, close, success, host, params, https } = args

    const wssUrl = `${https ? 'wss' : 'ws'}://${(host || (apiHost.indexOf('http') > -1 ? apiHost.split('://')[1] : apiHost)) + url}`

    let ws
    if ('WebSocket' in window) {
      ws = new WebSocket(wssUrl)

      // 链接关闭
      window.onbeforeunload = () => {
        if (close) {
          close.call(window, ws)
        }
        ws.close()
      }

      // 链接成功
      ws.onopen = () => {
        ws.send(params || 'ws')
        if (success) {
          success.call(window, ws)
        }

        // 防止3s自动断开链接，发送一次信息
        setInterval(() => {
          ws.send(params || 'ws')
        }, 30000)
      }

      // 接收到消息
      ws.onmessage = event => {
        if (message) {
          message.call(window, JSON.parse(event.data), ws)
        }
        resolve(ws)
      }

      // 链接错误
      ws.onerror = () => {
        const tips = 'WebSocket链接错误'
        reject(new Error(tips))
      }
    } else {
      const tips = '当前浏览器不支持WebSocket'
      console.error(tips)
      reject(new Error(tips))
    }
  } catch (err) {
    console.error(err)
    reject(err)
  }
}))

// 图片的 dataurl 转 blob
const dataURLtoBlob = dataurl => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}


/** 删除 cookies
 * @str: 需要删除的cookies前缀或名字
 */
const deleteCookies = (str = 'hx_') => {
  const strCookie = document.cookie
  const arrCookie = strCookie.split('; ')
  for (let i = 0; i < arrCookie.length; i++) {
    const arr = arrCookie[i].split('=')
    if (arr[0].indexOf(str) !== -1) {
      Cookies.remove(arr[0])
    }
  }
}

/*
  判断对象是否相等
 */
const diffObj = (obj1, obj2) => {
  const o1 = obj1 instanceof Object
  const o2 = obj2 instanceof Object
  if (!o1 || !o2) {
    /*  判断不是对象  */
    return obj1 === obj2
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false

  for (const attr in obj1) {
    const t1 = obj1[attr] instanceof Object
    const t2 = obj2[attr] instanceof Object
    if (t1 && t2) {
      return diffObj(obj1[attr], obj2[attr])
    } if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}

/** 数据类型转换为 String 类型
 */
const dataToStr = data => {
  const type = Object.prototype.toString.call(data).slice(8, -1)
  if (type === 'Number' || type === 'Array' || type === 'Boolean') {
    return data.toString()
  } if (type === 'String' || type === 'Undefined' || type === 'Null') {
    return data
  } if (type === 'Date') {
    return Date.parse(data).toString()
  } if (type === 'Object') {
    return JSON.stringify(data)
  }
    return data
}

/** 判断是否为 对象字符串
 * @str: 字符串
 */
const isJsonString = str => {
  try {
    if (Object.prototype.toString.call(JSON.parse(str)).slice(8, -1) === 'Object') {
      return true
    }
  } catch (e) {
    // console.log(e)
  }
  return false
}

/** 将数组转化为 select组件标准的list，[{name:XXX,value:XXX},...]
 * @param list 数组
 * @param nameKey name 字段对应的参数
 * @param valueKey value 字段对应的参数
 * @returns {[]}
 */
const formatToOptionList = (list, nameKey, valueKey) => {
  const newList = [];
  list.forEach(item => {
    newList.push({
      ...item,
      name: `${item[nameKey]}`,
      value: `${item[valueKey]}`,
    })
  })
  return newList;
}
/** 格式化金额 如：￥123,123.00
 * @param value 数值
 * @param fixNO 保留小数
 * @returns {string} 返回一个数
 */
const formatMoney = (value, fixNO = 0) => {
  if (Number(value) || Number(value) === 0) {
    value = Number(value).toFixed(fixNO).toString().split('.');
    value[0] = value[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), '$1,');
    return `￥ ${value.join('.')}`;
  }
  return '--'
}

/** 格式化日期
 * @param value 日期
 * @param format 格式
 * @returns {string}
 */
export const formatDate = (value, format = 'YYYY-MM-DD') => {
  if (!value) {
    return '';
  }
  return moment(value).format(format)
}
/** 格式化 银行卡号 如：6217 1234 4242 324
 * @param value 原本卡号
 * @returns {string}
 */
const formatBankCardNo = value => {
  if (Number(value)) {
    return value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
  }
  return '';
}

export {
  isCellPhone,
  isRightPsd,
  isEmail,
  formatTime,
  formatPublishTime,
  queryParam,
  sortBy,
  websocket,
  openNewWindow,
  addComma,
  dataURLtoBlob,
  deleteCookies,
  diffObj,
  isJsonString,
  dataToStr,
  formatToOptionList,
  formatBankCardNo,
  formatMoney,
}
