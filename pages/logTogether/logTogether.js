const app = getApp()
Page({
  data: {
    sw: 0,
    contentPro: [],
    signInNum: 1,
    isShowToast: true,
    toastData: '',
    imageTitle: '',
    isViewDisabled: true
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {

        that.setData({
          sw: res.windowWidth,
        })
      },
    })
  },
  onReady: function () {

  },
  onShow: function () {
    var that = this;
    that.getLogTogetherData();
    that.getSignInData();
    that.setData({
      isViewDisabled: true
    })
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  btn_q_d: function () {
    var that = this;
    if (that.data.signInNum == 1) {
      that.setData({
        isViewDisabled: false
      })
      wx.navigateTo({
        url: '../signIn/signIn',
      })
    } else {
      that.setData({
        isShowToast: false,
        toastData: '您今天已经签到了，请明天再来哦～',
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    }
  },
  getLogTogetherData: function () {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getUserInfoSignShow,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          var dataPro = res.data.data.info;
          for (var i = 0; i < dataPro.length; i++) {
            var j = dataPro[i].time.indexOf('-');
            var z = dataPro[i].time.substring(j + 1, dataPro[i].time.length);
            var q = z.indexOf('-');
            var t = z.substring(0, q);
            var p = z.substring(q + 1, z.length);
            console.log(j);
            console.log(z);
            console.log(t);
            console.log(p);
            dataPro[i]['month'] = t;
            dataPro[i]['day'] = p;
          }
          console.log(dataPro);
          that.setData({
            contentPro: dataPro,
            imageTitle: res.data.data.litpics
          })
        }
      }
    })
  },
  getSignInData: function () {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getSignIn,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          that.setData({
            signInNum: 0
          })
        } else if (res.data.code == -1) {
          that.setData({
            signInNum: 1,
          })
        }
      }
    })
  }
})