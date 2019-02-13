const app = getApp()
Page({
  data: {
    animation: {},
    showPan: true,
    integral: 0,
    rule: [],
    lottery_num: 0,
    record: [],
    isMysteriousGiftHide: true, // 隐藏中奖弹窗
  },
  onLoad: function (options) {
    var system = wx.getStorageSync('system').substr(0, 3)
    this.setData({
      'system': system
    })
    this.getMessage()
  },
  onReady: function () {
    console.log(414141)
    this.animation = wx.createAnimation({
      duration: 3000,
      timingFunction: "ease-in-out",
      delay: 0
    })
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
  xuanzhuan: function (rotate) {
    var that = this
    that.setData({
      showPan: false
    })
    that.setData({
      showPan: true
    })
    var animation = wx.createAnimation({
      duration: 3000,
      timingFunction: "ease-in-out",
      delay: 0
    })
    animation.rotate(8 * 360 + rotate).step()
    that.setData({ animation: animation.export() })
    setTimeout(function() {
      that.setData({
        animation: {},
        hasCode: false,
        isMysteriousGiftHide: false
      })
      // wx.showModal({
      //   title: '恭喜您中奖啦',
      //   content: ''
      // })
      
    }, 3500)
  },
  // 获取中奖信息
  getCode () {
    if (this.data.hasCode) {
      return
    }
    let self = this,
    url = `${app.baseUrl}/interface/Home_page/start_prize`,
    data = {}
    data = {
      'openid': app.globalData.openId,
    }
    self.getMessage()
    app.wxRequest(url, data, (res) => {
      console.log('中奖信息', res)
      if (res.data.code == 1) {
        res.data.data.prize.litpic = app.ossImgUrl + res.data.data.prize.litpic
        self.setData({
          hasCode: true,
          prize: res.data.data.prize,
        })
        self.xuanzhuan(res.data.data.bug)
      }
    })
  },
  getMessage () {
    let that = this,
      url = `${app.baseUrl}/interface/Home_page/prize_info`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      per_page: 1,
      limit: 10
    }
    app.wxRequest(url, data, (res) => {
      console.log('抽奖首页', res)
      if (res.data.code == 1) {
        res.data.data.lottery_bg = app.ossImgUrl + res.data.data.lottery_bg
        that.setData({
          integral: res.data.data.integral,
          rule: res.data.data.rule,
          lottery_num: res.data.data.lottery_num,
          record: res.data.data.record,
          lottery_bg: res.data.data.lottery_bg
        })
        console.log(that.data, 111111)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          mask: true
        })
      }
    })
  },
  chongzhi () {
    wx.navigateTo({
      url: '/pages/personalHomepage/chargeWiseBean/chargeWiseBean',
    })
  },
  // 隐藏神秘大礼弹窗
  hideMystGift() {
    this.setData({ 'isMysteriousGiftHide': true })
  },
  // 弹窗确定
  confirmBtnClick() {
    this.setData({
      isMysteriousGiftHide: true
    })
  }
})