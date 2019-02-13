function getTimeData(timeDay, time) {
  var today = getNowFormatDate();
  // console.log(today);
  var goday = dateAdd(timeDay, time);
  // console.log(goday);
  return timeDifference(today, goday);

  function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var hours = date.getHours();
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    var minutes = date.getMinutes();
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    var seconds = date.getSeconds();
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + hours + seperator2 + minutes + seperator2 + seconds;
    return currentdate;
  }

  function dateAdd(startDate, numDay) {
    startDate = startDate.replace(/-/g, '/') // ios兼容
    startDate = new Date(startDate);
    startDate = +startDate + numDay * 1000 * 60 * 60 * 24;
    startDate = new Date(startDate);
    var month = startDate.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    var day = startDate.getDate();
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    var hours = startDate.getHours();
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    var minutes = startDate.getMinutes();
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    var seconds = startDate.getSeconds();
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var nextStartDate = startDate.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return nextStartDate
  }

  function timeDifference(startTime, endTime) {
    startTime = new Date(startTime.replace(/-/g, '/'))
    endTime = new Date(endTime.replace(/-/g, '/'))
    return endTime - startTime < 0 ? 0 : endTime - startTime
  }
}

/**
 * 时间转换
 * timeLength 时间戳长度
 */
function transTime(timeLength) {
  let nowTime = new Date(timeLength),
    hours = Math.floor(nowTime / (3600 * 1000))
  if (hours < 10) hours = "0" + hours
  //计算相差分钟数  
  let leave2 = nowTime % (3600 * 1000), //计算小时数后剩余的毫秒数  
    minutes = Math.floor(leave2 / (60 * 1000))
  if (minutes < 10) minutes = "0" + minutes
  //计算相差秒数  
  let leave3 = leave2 % (60 * 1000), //计算分钟数后剩余的毫秒数  
    seconds = Math.round(leave3 / 1000)
  if (seconds < 10) seconds = "0" + seconds
  const time = hours + ":" + minutes + ":" + seconds
  return time
}


//////////////////
function getTimeData1(timeDay, time) {
  var today = getNowFormatDate();
  // console.log(today);
  var goday = dateAdd(timeDay, time);
  // console.log(goday);
  return timeDifference(today, goday);

  function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var hours = date.getHours();
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    var minutes = date.getMinutes();
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    var seconds = date.getSeconds();
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
      " " + hours + seperator2 + minutes +
      seperator2 + seconds;
    return currentdate;
  }

  function dateAdd(startDate, numDay) {
    startDate = startDate.replace(/-/g, '/') // ios兼容    
    startDate = new Date(startDate);
    startDate = +startDate + numDay * 1000 * 60 * 60 * 24;
    startDate = new Date(startDate);
    var month = startDate.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    var day = startDate.getDate();
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    var hours = startDate.getHours();
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    var minutes = startDate.getMinutes();
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    var seconds = startDate.getSeconds();
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var nextStartDate = startDate.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return nextStartDate;
  }

  function timeDifference(startTime1, endTime1) {
    startTime1 = startTime.replace(/-/g, '/')
    endTime1 = endTime.replace(/-/g, '/')
    var startTime = new Date(startTime1);
    var endTime = new Date(endTime1);
    // console.log(startTime - endTime);
    var nowTime = endTime.getTime() - startTime.getTime();
    // console.log(nowTime);
    if (nowTime <= 0) {
      var timeObj = {
        'hours': '00',
        'minutes': '00',
        'seconds': '00'
      };
      return timeObj;
    }
    var hours = Math.floor(nowTime / (3600 * 1000));
    if (hours < 10) {
      hours = "0" + hours;
    }
    //计算相差分钟数  
    var leave2 = nowTime % (3600 * 1000); //计算小时数后剩余的毫秒数  
    var minutes = Math.floor(leave2 / (60 * 1000));
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    //计算相差秒数  
    var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数  
    var seconds = Math.round(leave3 / 1000);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    var timeObj = {};
    timeObj['hours'] = hours;
    timeObj['minutes'] = minutes;
    timeObj['seconds'] = seconds;
    return timeObj;
  }
}

module.exports = {
  transTime,
  getTime: getTimeData,
  getTimes: getTimeData1
}