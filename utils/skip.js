
/**
 * 跳转的封装
 * 参数介绍
 * that 当前页
 * url 跳转页面路径
 * parameterStrng 路径后面的参数
 * isJudgeNetWork 判断是否需要过滤网络判断
 */


/**
 * 保留当前页跳转新的页面
 */
function navigateWx(that, url, parameterStrng = null, isJudgeNetWork = true) {

  var app = getApp();
  var pageUrl = getCurrentPages()[getCurrentPages().length - 1].route;

  if (!app.globalData.isNetwork && isJudgeNetWork) {

    notNetwork(that);
    return;
  }
  if (parameterStrng == null) {
    parameterStrng = '';
  }

  if (pageUrl != subPage(url)) {
    wx.navigateTo({
      url: url + parameterStrng,
    })
  }
}
/**
 * 销毁当前页跳转新的页面
 */
function redirectWx(that, url, parameterStrng = null, isJudgeNetWork = true) {
  var app = getApp();
  var pageUrl = getCurrentPages()[getCurrentPages().length - 1].route;

  if (!app.globalData.isNetwork && isJudgeNetWork) {

    notNetwork(that);
    return;
  }

  if (parameterStrng == null) {
    parameterStrng = '';
  }

  if (pageUrl != subPage(url)) {
    wx.redirectTo({
      url: url + parameterStrng,
    })
  }
}
/**
 * 切换tab
 */
function switchTabWx(that, url, parameterStrng = null, isJudgeNetWork = true) {
  var app = getApp();
  var pageUrl = getCurrentPages()[getCurrentPages().length - 1].route;

  if (!app.globalData.isNetwork && isJudgeNetWork) {

    notNetwork(that);
    return;
  }

  if (parameterStrng == null) {
    parameterStrng = '';
  }
  if (pageUrl != subPage(url)) {
    wx.switchTab({
      url: url + parameterStrng,
    })
  }
}
/**
 * 销毁所有页面，跳转新的页面
 */
function reLaunchWx(that, url, parameterStrng = null, isJudgeNetWork = true) {
  var app = getApp();
  var pageUrl = getCurrentPages()[getCurrentPages().length - 1].route;

  if (!app.globalData.isNetwork && isJudgeNetWork) {

    notNetwork(that);
    return;
  }

  if (parameterStrng == null) {
    parameterStrng = '';
  }

  if (pageUrl != subPage(url)) {
    wx.reLaunchTo({
      url: url + parameterStrng,
    })
  }
}

function notNetwork(that) {

  wx.showModal({
    title: '提示',
    content: '当前网络状态不佳，请检查您的网络',
    showCancel: false,
    confirmText: '我知道了',
    success: function (res) {
    }
  })

}


function subPage(url) {
  return 'pages' + url.substr(url.lastIndexOf('.') + 1, url.length);
}

module.exports = {
  navigateWx: navigateWx,
  redirectWx: redirectWx,
  switchTabWx: switchTabWx,
  reLaunchWx: reLaunchWx
}