

/** 
 * POST request
 */
function requestPost(that, url, parameter, doSuccess, doFail, doComplete) {
  var app = getApp();

  if (!app.globalData.isNetwork) {
    wx.showModal({
      title: '提示',
      content: '当前网络状态不佳，请检查您的网络',
      showCancel: false,
      confirmText: '我知道了',
    })
    return;
  }

  wx.request({
    url: url,
    data: parameter,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(res);

      if (typeof doSuccess == "function") {

        doSuccess(res);
      }
    },
    fail: function () {
      failRequest(doFail);
    },
    complete: function () {

      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  })
}
/**
 * GET request
 */
function requestGet(that, url, doSuccess, doFail, doComplete) {
  var app = getApp();

  if (!app.globalData.isNetwork) {
    wx.showModal({
      title: '提示',
      content: '当前网络状态不佳，请检查您的网络',
      showCancel: false,
      confirmText: '我知道了',
    })
    return;
  }

  wx.request({
    url: url,
    method: 'GET',
    success: function (res) {
      console.log(res);

      if (typeof doSuccess == "function") {
        doSuccess(res);
      }
    },
    fail: function () {
      failRequest(doFail);
    },
    complete: function () {

      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  })
}


function failRequest(doFail) {

  var app = getApp();
  var failObj = {
    isNetwork: true
  };
  if (!app.globalData.isNetwork) {
    wx.showModal({
      title: '提示',
      content: '当前网络状态不佳，请检查您的网络',
      showCancel: false,
      confirmText: '我知道了',
    })
    failObj = {
      isNetwork: false
    }
  }

  if (typeof doFail == "function") {
    doFail(failObj);
  }
}

module.exports = {
  requestPost: requestPost,
  requestGet: requestGet
}