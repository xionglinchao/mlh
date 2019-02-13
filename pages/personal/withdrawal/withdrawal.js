const app = getApp()

Page({
  data: {

  },
  onLoad: function (options) {
    this.setData({
      totalMoney: options.totalMoney || null
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
  // 所提取的金额
  bindInputValue(e) {
    console.log(e)
    let money = e.detail.value
    this.setData({
      'money': money
    })
  },
  // 全部提现
  allInClick() {
    this.setData({
      money: this.data.totalMoney
    })
  },
  // 提现
  moneyWithdrawal() {
    if (Number(this.data.money) >= 1 && Number(this.data.money) <= Number(this.data.totalMoney)) {
      let self = this,
        url = `${app.baseUrl}/interface/Pay/withdraw`,
        data = {}
      data = {
        'openid': app.globalData.openId,
        'amount': self.data.money
      }
      app.wxRequest(url, data, (res) => {
        console.log('提现结果', res)
        if (res.data.code == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的申请金额',
        icon: 'none',
        duration: 1000
      })
    }
  }
})