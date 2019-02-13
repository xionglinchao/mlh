const app = getApp();
Page({
  data: {
    
  },
  onLoad: function (options) {
    this.setData({
      'userId': options.userId
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getPartnerDetail()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  // onShareAppMessage: function () {

  // }
  // 获取伙伴详情
  getPartnerDetail() {
    var that = this, url = `${app.baseUrl}/interface/Login/friend_detail_month`, data = {}
    data = {
      id: that.data.userId
    }
    app.wxRequest(url, data, (res) => {
      console.log('伙伴详情', res)
      if(res.data.code == 1) {
        that.setData({
          'userInfo': res.data.data,
          'recentSixMonth': res.data.data.month
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
})