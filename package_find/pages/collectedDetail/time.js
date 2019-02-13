/**
 * 使用时，需要注意函数节流
 * 优化方向 => 函数柯里化
 * 根据目标时间计算 || 开始时间+持续时间计算 可以通过修改手机时间改变倒此不建议使用计时，因
 * 建议使用 根据时间差计算倒计时方法
 */
/////////////函数部分//////////////
/**
 * 时间对象格式化
 * @param {Any} date
 * return {String} 'yyyy/MM/dd hh:mm:ss'时间格式
 */
const dateFormat = (date) => {
  if (typeof date !== 'object') return date.replace(/-/g, '/')
  const year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds(),
    formatNum = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
  return [year, month, day].map(formatNum).join('/') + ' ' + [hour, minute, second].map(formatNum).join(':')
}
/**
 * 获取结束时间
 * @param {String} createDay 创建日期
 * @param {Number} num       计算数值
 * @param {String} unit      计算单位
 * return {String} endTime   结束时间
 */
const getEndTime = ((createDay, num, unit) => {
  createDay = createDay.replace(/-/g, '/') // 将'yyyy-mm-dd'各式替换为'yyyy/mm/dd'以兼容ios
  let endTime
  switch (unit) {
    case '年':
      endTime = +(new Date(createDay)) + num * 365 * 24 * 60 * 60 * 1000
      break
    case '月':
      endTime = +(new Date(createDay)) + num * 30 * 24 * 60 * 60 * 1000
      break
    case '周':
      endTime = +(new Date(createDay)) + num * 7 * 24 * 60 * 60 * 1000
      break
    case '天':
      endTime = +(new Date(createDay)) + num * 24 * 60 * 60 * 1000
      break
    case '时':
      endTime = +(new Date(createDay)) + num * 60 * 60 * 1000
      break
    case '分':
      endTime = +(new Date(createDay)) + num * 60 * 1000
      break
    case '秒':
      endTime = +(new Date(createDay)) + num * 1000
      break
    default:
      endTime = +(new Date(createDay)) + num * 24 * 60 * 60 * 1000
      break
  }
  endTime = new Date(endTime)
  return dateFormat(endTime)
})
/**
 * 获取时差
 * @param {String} now 当前时间
 * @param {String} end 截止时间
 * return {Number} 1.timeDiff 时差  2.-1 未开始 3.-2 已结束
 */
const getRemainTime = (start, end) => {
  const _end = new Date(end),
    _start = new Date(start),
    _now = new Date()
  if (_start <= _now && _now < _end) { // 判断是否在当前时间是否在开始和结束时间内
    const timeDiff = _end - _now
    return timeDiff
  } else if (_start > _now) {
    return -1
  } else if (_now > _end) {
    return -2
  }
}
/**
 * 时间戳格式化
 * @param {Number} timeStamp 时间戳
 * return {String} 'dd:hh:mm:ss'时间格式
 */
const timeStampFormat = (timeStamp) => {
  // const d = Math.floor(timeStamp / 1000 / 3600 / 24)
  let h = Math.floor(timeStamp / 1000 / 3600)
  let m = Math.floor(timeStamp / 1000 / 60 % 60)
  let s = Math.floor(timeStamp / 1000 % 60)
  const formatNum = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  // if (d === 0) // 如果有天数，则返回天数，没有则只返回时分秒
  // return [h, m, s].map(formatNum).join(':')

  if (h < 10) {
    h = `0${h}`
  }
  if (m < 10) {
    m = `0${m}`
  }
  if (s < 10) {
    s = `0${s}`
  }
  return `${h}时${m}分${s}秒`
  // else
  // return [d, h, m, s].map(formatNum).join(':')
}

/**
 * 根据结束时间计算倒计时
 * @params {String} 结束日期
 * return {Object || String} 1.{ 倒计时时间格式，时间数据分割数组 } 2.超出提示
 */
const calculByEndDate = (endDate) => {
  endDate = dateFormat(endDate)
  let remainTime = +new Date(endDate) - +(new Date)
  if (remainTime >= 0) {
    const countdownTime = timeStampFormat(remainTime)
    return countdownTime
  } else {
    return remainTime
  }
}

/**
 * 根据时间差计算倒计时
 * @params {timeDiff} 时间差
 * return {Object || String} 1.{ 倒计时时间格式，时间数据分割数组 } 2.超出提示
 */
const calculByTimeDiff = (timeDiff) => {
  // count-time.js中
}

/**
 * 根据活动持续时间计算倒计时
 * @param {String || Object} start 开始时间
 * @param {Number} num   计算数值
 * @param {String} unit  计算单位
 * return {Object || String} 1.{ 倒计时时间格式，时间数据分割数组 } 2.超出提示
 */
const calcaulByDuration = (start, num, unit) => {
  start = dateFormat(start)
  const end = getEndTime(start, num, unit)
  const remainTime = getRemainTime(start, end)
  if (remainTime >= 0) {
    const countdownTime = timeStampFormat(remainTime)
    return countdownTime
  } else {
    return remainTime
  }
}


module.exports = {
  dateFormat,
  getEndTime,
  getRemainTime,
  timeStampFormat,
  calculByEndDate,
  calculByTimeDiff,
  calcaulByDuration,
}