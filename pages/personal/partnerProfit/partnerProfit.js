const app = getApp()

Page({
  data: {
    tab: 0, // 选项卡下标
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.getPartnerProfitInfo()
    this.getPersonalProfitInfo()
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
  // 选项卡点击
  tabBtnClick() {
    this.setData({
      'tab': 0,  // 团队业绩
    })
  },
  tabSecBtnClick() {
    this.setData({
      'tab': 1,  // 个人资金
    })
  },
  // 获取团队业绩记录页面信息
  getPartnerProfitInfo() {
    let self = this, url = `${app.baseUrl}/interface/UserInfo/friend_achievement`, data = {}
    data = {
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, (res) => {
      console.log('团队业绩记录', res)
      if (res.data.code == 1) {
        self.setData({
          'baseInfo': res.data.data,
          'userInfo': res.data.data.user,
          'recorderList': res.data.data.term
        })
      }
    })
  },
  // 获取个人资金记录页面信息
  getPersonalProfitInfo() {
    let self = this, url = `${app.baseUrl}/interface/UserInfo/friend_profit_balance`, data = {}
    data = {
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, (res) => {
      console.log('个人资金记录', res)
      if(res.data.code == 1) {
        this.setData({
          'personalRecord': res.data.data.month
        })
      }
    })
  },
  // 选择查看日期
  chooseDate(e) {
    let time = e.detail.value  // 指定月份
    let self = this, url = `${app.baseUrl}/interface/UserInfo/friend_fixed_profit`, data = {}
    data = {
      'openid': app.globalData.openId,
      'time': time,
      'type': self.data.tab,  // 0是 团队 1是个人
    }
    app.wxRequest(url, data, (res) => {
      console.log('指定月份', res)
      if (res.data.code == 1) {
        if (self.data.tab == 0) {
          self.setData({
            'recorderList': res.data.data.term,
          })
        } else {
          self.setData({
            'personalRecord': res.data.data.month,
          })
        }
      }
    })
  },
  // 查看下级业绩详情
  toSubordinateDetail(e) {
    let id = e.currentTarget.dataset.item.id  // 所绑定下级的id
    let o_id = e.currentTarget.dataset.item.openid  // 所绑定下级的openid
    wx.navigateTo({
      url: '/pages/personal/subordinateDetail/subordinateDetail?id=' + id + '&o_id=' + o_id,
    })
  },
  // 提现页面跳转
  withdrawBtnClick(e) {
    let totalMoney = e.currentTarget.dataset.item.portable_money
    wx.navigateTo({
      url: '/pages/personal/withdrawal/withdrawal?totalMoney=' + totalMoney,
    })
  },
})