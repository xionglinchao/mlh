// pages/login/login.js
const app = getApp()
const isPhone = require('../../utils/isPhone.js');
Page({
  data: {
    phone: '',
    timeInt: 60,
    timeData: '获取验证码',
    isShowToast: true,
    toastData: '',
    isSend: false,
    isDisabled: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function(options) {
    var that = this;

  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  btn_code: function() {
    var that = this;
    var phone = that.data.phone;
    that.setData({
      isDisabled: true
    })
    if (that.data.timeInt < 60) {
      return;
    }
    if (phone == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入手机号',
        isSend: false,
        isDisabled: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })

      }, 2000)
    } else if (!isPhone.phone(phone)) {
      that.setData({
        isShowToast: false,
        toastData: '手机号格式不对',
        isDisabled: false,
        isSend: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      wx.request({
        url: app.globalData.urlApi.getCode,
        data: {
          openid: app.globalData.openId,
          phone: phone
        },
        success: function(res) {
          console.log(res);
          if (res.data.code == 1) {
            that.countDowm(that);
          } else if (res.data.code == -1 || res.data.code == -2 || res.data.code == -3) {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
              isDisabled: false
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
              })
            }, 2000)
          }
        }
      })
    }
  },
  btn_phone: function(e) {
    console.log(e);
    this.setData({
      phone: e.detail.value
    })
  },
  countDowm: function(that) {
    var time = that.data.timeInt;
    if (time == 0) {
      that.setData({
        timeInt: 60,
        timeData: '获取验证码',
        isDisabled: false
      })
    } else {
      setTimeout(function() {
        that.setData({
          timeInt: time - 1,
          timeData: (time - 1) + 's'
        })
        that.countDowm(that);
      }, 1000)
    }
  },
  btn_submit: function(e) {
    var item = e.detail.value;
    var that = this;
    that.setData({
      isSend: true
    })
    if (item.phone == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入手机号',
        isSend: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (!isPhone.phone(item.phone)) {
      that.setData({
        isShowToast: false,
        toastData: '手机号格式不对',
        isSend: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (item.yzm == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入验证码',
        isSend: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      wx.request({
        url: app.globalData.urlApi.getLogin,
        data: {
          openid: app.globalData.openId,
          phone: item.phone,
          code: item.yzm
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
              })
              if (app.globalData.loginSend == 0) {
                wx.navigateBack({
                  delta: 1
                })
              } else {
                app.globalData.loginSend = 0;
                wx.redirectTo({
                  url: '../send/send?typeNum=4&dataPro=' + JSON.stringify(app.globalData.openPro),
                })
              }
            }, 2000)
          } else if (res.data.code == 2) {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
              isSend: false
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
              })
            }, 2000)
          } else {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
              isSend: false
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
              })
            }, 2000)
          }
        }
      })
    }
  }
})