const app = getApp()

Page({
  data: {
    
  },
  onLoad: function (options) {
    this.setData({
      'id': options.id || null,     // 所绑定下级的id
      'o_id': options.o_id || null   // 所绑定下级的openid
    })
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.getPersonalProfitDetail()
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
  // 获取个人业绩详情页面信息
  getPersonalProfitDetail() {
    let self = this, url = `${app.baseUrl}/interface/UserInfo/friend_achievement_detail`, data = {}
    data = {
      'id': self.data.id,   // 所绑定下级的id
    }
    app.wxRequest(url, data, (res) => {
      console.log('个人业绩详情', res)
      if (res.data.code == 1) {
        self.setData({
          'userInfo': res.data.data.user,
          'personProfit': res.data.data,
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
      'openid': self.data.o_id,
      'time': time,
      'type': 1,  // 0是 团队 1是个人
    }
    app.wxRequest(url, data, (res) => {
      console.log('指定月份', res)
      if (res.data.code == 1) {
        self.setData({
          'personalRecord': res.data.data.month,
        })
      }
    })
  },
})