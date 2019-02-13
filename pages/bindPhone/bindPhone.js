const app = getApp()
Page({
  data: {
    time: '获取验证码', //倒计时 
    currentTime: 60,
    disabled: false
  },
  onLoad: function (options) {
    this.setData({
      'openId': options.openId || null,
    })
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
  //验证码倒计时函数
  getCode() {
    let that = this
    if (!that.data.phoneNum) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    wx.navigateToMiniProgram({
      appId: 'wxb7c8f9ea9ceb4663',
      path: 'pages/captcha/index',
      extraData: {
        captchaId: 'd217d61693664001a3b6341eb5360e22'
      },
      envVersion: '',
      success(res) {
        // 打开成功
      }
    })
    let currentTime = that.data.currentTime, interval = null
    that.setData({
      time: currentTime + 's'
    })
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + 's',
        disabled: true
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          disabled: false
        })
      }
    }, 1000)
  },
  // 获取手机号
  phoneIput(e) {
    wx.setStorageSync('phoneNum', e.detail.value)
    this.setData({
      'phoneNum': e.detail.value
    })
  },
  
  // 获取短信验证码
  smsInput(e) {
    this.setData({
      'smsInput': e.detail.value
    })
  },
  // 绑定手机号
  bindPhone() {
    let that = this, url = `${app.baseUrl}/interface/Login/bindPhone`, data = {}
    if (!that.data.smsInput || !that.data.phoneNum) {
      wx.showToast({
        title: '请输入所有信息',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    data = {
      'openid': that.data.openId || app.globalData.openId,
      'sms_code': that.data.smsInput,
      'phone': that.data.phoneNum
    }
    console.log('77777777777777', data)
    app.wxRequest(url, data, (res) => {
      console.log('绑定手机号', res)
      if(res.data.code != 1) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
        return false
      }
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
      wx.navigateBack({
        delta: 1
      })
      console.log('vvvvvvvvvvvvv')
    })
  }
})