var app = getApp();
Page({
  data: {
    // 充值列表
    chargeBeanList: [],
    // 充值说明
    chargeInstruction: [
    ],
    info: {
      id: "",
      integral: 0,
      litpic: "",
      signature: "",
      username: ""
    }
  },
  onLoad: function(options) {
    this.getMessage()
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
  getMessage() {
    var that = this
    var url = `${app.baseUrl}/interface/Home_page/recharge`
    wx.request({
      url: url,
      data: {
        openid: app.globalData.openId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function(res) {
        console.log(res);
        if (res.data.code == 1) {
          that.setData({
            chargeBeanList: res.data.data.lists,
            chargeInstruction: res.data.data.rule,
            info: res.data.data.info
          })
        }
      }
    })
  },
  chongzhi(e) {
    var that = this
    console.log(e.target.id, 11313131)
    var id = e.target.id
    if (!id) {
      return
    }
    wx.request({
      url: `${app.baseUrl}/interface/Pay/buy_integral`,
      data: {
        openid: app.globalData.openId,
        id: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        if (res.data.code == 1) {
          var item = res.data.msg.config;
          wx.requestPayment({
            'timeStamp': item.timestamp,
            'nonceStr': item.nonceStr,
            'package': item.package,
            'signType': item.signType,
            'paySign': item.paySign,
            'success': function (result) {
              wx.showToast({
                title: '支付成功',
                mask: true
              })
              that.getMessage()
            },
            'fail': function (result) {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                mask: true
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })
        }
      }
    })
  }
})