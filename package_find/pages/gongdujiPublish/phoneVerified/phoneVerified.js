var interval = null // 倒计时函数
const app = getApp()
Page({
  data: {
    time: '获取验证码', //倒计时 
    currentTime: 60,
    phone:''
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
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
  getCode: function (options) {
    var self = this;
    var currentTime = self.data.currentTime
    self.setData({
      time: currentTime + 's'
    })
    interval = setInterval(function () {
      currentTime--;
      self.setData({
        time: currentTime + 's'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        self.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    this.getCode();
    var self = this
    self.setData({
      disabled: true
    })
  },
  myPhone (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 开通课程登记手机号
  bindPhone () {
    var that = this
    var phone = this.data.phone
    if (phone.length != 11) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }
    var url = app.baseUrl + '/interface/Course/open_course'
    var data = {
      openid: app.globalData.openId,
      phone: phone
    }
    app.wxRequest(url, data, function (res) {
      if (res.data.code == 1) {
        wx.navigateTo({
          url: '../openSuccess/openSuccess',
        })
      }
    })
  },
})