const app = getApp()

Page({
  data: {
    isRuleIntroHide: true,  // 规则介绍弹窗隐藏
    hideRecorder: true,
    chooseDate: ''  // 选择查看的日期
  },
  onLoad: function (options) {
    this.setData({
      username: options.username || null
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getProfitInfo()
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
  // 规则介绍点击事件
  ruleBtnClick() {
    this.setData({ 'isRuleIntroHide': !this.data.isRuleIntroHide })
  },
  // 规则介绍关闭事件
  showRulePopup() {
    this.setData({ 'isRuleIntroHide': !this.data.isRuleIntroHide })
  },
  // 获取利润详情信息
  getProfitInfo() {
    let self = this, url = `${app.baseUrl}/interface/Login/profit_info`, data = {}
    data = {
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, (res) => {
      console.log('利润余额', res)
      if(res.data.code != 1) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
        return false
      }
      let totalMoney = (res.data.data.profit - res.data.data.withdraw).toFixed(2)
      self.setData({
        'profit': res.data.data,
        'rule': res.data.data.rule,
        'totalMoney': totalMoney
      })
      self.checkDate()
    })
  },
  // 查看日期
  checkDate() {
    let self = this, url = `${app.baseUrl}/interface/Login/fixed_profit`, data = {}
    data = {
      'openid': app.globalData.openId,
      'time': self.data.chooseDate
    }
    app.wxRequest(url, data, (res) => {
      console.log('指定月份', res)
      if (res.data.code != 1) {
        wx.showToast({
          title: res.data.errMsg,
          icon: 'none',
          duration: 1000
        })
        return false
      }
      self.setData({
        'monthRecorder': res.data.data.lists,
        'mon_profit': res.data.data.profit,
        'mon_withdraw': res.data.data.withdraw
      })
    })
  },
  // 选择日期
  chooseCheckDate(e) {
    let chooseDate = e.detail.value
    this.setData({
      'chooseDate': chooseDate + '-01'
    })
    this.checkDate()
  },
  // 提现
  withdrawalBtnClick() {
    let totalMoney = this.data.totalMoney
    wx.navigateTo({
      url: '/pages/personal/withdrawal/withdrawal?totalMoney=' + totalMoney,
    })
  },
  // 粉丝列表跳转
  toFansList() {
    if (this.data.profit.user_count > 0) {
      wx.navigateTo({
        url: '/pages/fansList/fansList?fansType=0'
      })
    }
  },
  // 伙伴详情页面跳转
  toPartnerList() {
    if (this.data.profit.distribute_count > 0) {
      wx.navigateTo({
        url: '/pages/fansList/fansList?fansType=1',
      })
    }
  },
  // 29号前数据查看
  beforeDataCheck() {
    let that = this, url = `${app.baseUrl}/interface/UserInfo/before_profit`, data = {}
    data = {
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, (res) => {
      console.log('29号前数据', res)
      if (res.data.code == 1) {
        that.setData({
          'monthRecorder': res.data.data
        })
      }
    })
  }
})