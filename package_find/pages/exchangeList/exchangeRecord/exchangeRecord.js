const app = getApp()

Page({
  data: {
    curPage: 1,  // 当前页码
    contentlist: [],  // 兑换列表
    pageSize: 10,
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.getExchangeRecordList()
  },
  onHide: function () {
    
  },
  onUnload: function () {
    
  },
  onPullDownRefresh: function () {
    
  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getExchangeRecordList('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none',
        duration: 1000
      })
    }
  },
  onShareAppMessage: function () {
    
  },

  // 获取兑换记录列表
  getExchangeRecordList() {
    let self = this, url = `${app.baseUrl}/interface/GiftShop/exchange_order`, data = {}
    data = {
      'openid': app.globalData.openId,
      'limit': self.data.pageSize,
      'per_page': self.data.curPage
    }
    app.wxRequest(url, data, (res) => {
      console.log('兑换记录', res)
      if (res.data.code == 1) {
        for (let i = 0; i < res.data.data.length; ++i) {
          res.data.data[i].gift.litpic = app.ossImgUrl + res.data.data[i].gift.litpic
        }
        var contentlistTem = self.data.contentlist
        if (self.data.curPage == 1) {
          contentlistTem = []
        }
        var contentlist = res.data.data
        if (contentlist.length < self.data.pageSize) {
          self.setData({
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': false
          })
        } else {
          self.setData({
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': true,
            'curPage': self.data.curPage + 1
          })
        }
      }
    })
  }
})