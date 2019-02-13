const app = getApp()

Page({
  data: {
    // 捐赠排行榜
    donationRankList: [
      {
        'userPhoto': '../../../images/activityDetail/book_pic.jpg', // 用户头像
        'userName': '吉吉国王', // 用户名
        'donationBean': '2', // 捐赠豆
      },
    ],
  },
  onLoad: function (options) {
    this.setData({
      userId: options.userId || null
    })
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.getDonateListInfo()
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
  // 获取捐赠信息
  getDonateListInfo() {
    let self = this, url = `${app.baseUrl}/interface/Home_page/donate_list`, data = {}
    data = {
      'id': this.data.userId
    }
    app.wxRequest(url, data, (res) => {
      console.log('捐赠榜单',res)
      this.setData({
        'donateList': res.data.data
      })
    })
  },
  // 跳转个人主页
  toPersonalHomepage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + id,
    })
  }
})