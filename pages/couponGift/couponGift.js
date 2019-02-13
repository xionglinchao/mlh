const app = getApp()
Page({
  data: {
    
  },
  onLoad: function (options) {
    console.log('options',options)
    this.setData({
      'couponId': options.id || null,  // 优惠券id
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.get_is_login(this)
    this.getShareCouponInfo()
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
  // 优惠券分享详情
  getShareCouponInfo() {
    let that = this, url = `${app.baseUrl}/interface/Coupon/couponDetail`, data = {}
    data = {
      'id': that.data.couponId
    }
    app.wxRequest(url, data, (res) => {
      console.log('优惠券分享详情',res)
      that.setData({
        'coupon': res.data.data.coupon[0],
        'ruleList': res.data.data.rule,
        'userInfo': res.data.data.user,
        'receiveInfo': res.data.data.receive
      })
    })
  },
  // 领取优惠券
  getCouponGift() {
    if(this.data.isLogin == 1) {
      let that = this, url = `${app.baseUrl}/interface/Coupon/receive`, data = {}
      data = {
        'openid': app.globalData.openId,
        'id': that.data.couponId
      },
        app.wxRequest(url, data, (res) => {
          console.log('领取优惠券', res)
          if(res.data.code == 1) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
            that.getShareCouponInfo()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
    } else {
      wx.navigateTo({
        url: '/pages/forceLogin/forceLogin',
      })
    }
  },

  // 判断是否登录
  get_is_login: function (self) {
    wx.request({
      url: app.globalData.urlApi.getExist,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        console.log('2222', res)
        if (res.data.code == 1) {
          self.setData({
            isLogin: 1
          })
        }
      }
    })
  },
  // 前往查看
  toCheckPage() {
    if(this.data.isLogin == 1) {
      wx.redirectTo({
        url: '/pages/coupon/coupon?typeNum=1',
      })
    } else {
      wx.navigateTo({
        url: '/pages/forceLogin/forceLogin',
      })
    }
  },
})