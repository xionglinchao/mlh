
function getTimeData(dateString) {
  var newTime = strToDate(dateString);
  var nowTime = strToDate(getNowFormatDate());

  return timeDifference(newTime, nowTime);
}

function timeDifference(startTime, endTime) {


  var nowTime = endTime.getTime() - startTime.getTime();

  if (nowTime <= 0) {
    var timeObj = { 'hours': '00', 'minutes': '00', 'seconds': '00' };
    return timeObj;
  }
  var years = Math.floor(nowTime / (365 * 3600 * 1000 * 24));
  var leave01 = nowTime % (365 * 3600 * 1000 * 24);
  var months = Math.floor(leave01 / (30 * 3600 * 1000 * 24));
  var leave0 = leave01 % (30 * 3600 * 1000 * 24);

  var days = Math.floor(leave0 / (3600 * 1000 * 24));

  var leave1 = leave0 % (3600 * 1000 * 24);

  var hours = Math.floor(leave1 / (3600 * 1000));

  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数  
  var minutes = Math.floor(leave2 / (60 * 1000));

  //计算相差秒数  
  var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数  
  var seconds = Math.round(leave3 / 1000);

  var timeObj = {};
  timeObj['hours'] = hours;
  timeObj['minutes'] = minutes;
  timeObj['seconds'] = seconds;
  if (years > 0) {
    return years + '年前';
  } else {
    if (months > 0) {
      return months + '月前'
    } else {
      if (days > 0) {
        return days + '天前';
      } else {

        if (hours > 0) {
          return hours + '小时之前';
        } else {
          if (minutes > 0) {
            return minutes + '分钟之前';
          } else {
            return '刚刚';
          }
        }
      }
    }
  }

}

function strToDate(dateObj) {
  dateObj = dateObj.replace(/(-)/g, '/');
  return new Date(dateObj)
}

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
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + hours + seperator2 + minutes
    + seperator2 + seconds;
  return currentdate;
}


module.exports = {
  timeNum: getTimeData,

}