const app = getApp()

Page({
  data: {
    page: 1,  // 关注页面当前页码
    callbackcount: 10, //需要返回数据的个数
    bookList: [],  // 书本列表
  },
  onLoad: function (options) {
    this.setData({
      id: options.id || null
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getMoreBookInfo()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getMoreBookInfo()
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
  // 获取更多列表页面信息
  getMoreBookInfo() {
    let self = this, url = `${app.baseUrl}/interface/Shop/show_more`, data = {}
    data = {
      'id': this.data.id,
      'per_page': self.data.page,
      'limit': self.data.callbackcount
    }
    app.wxRequest(url, data, (res) => {
      console.log('更多列表',res)
      if(res.data.code == 1) {
        res.data.data.info.litpic = app.ossImgUrl + res.data.data.info.litpic
        var contentlistTem = self.data.bookList
        if (self.data.page == 1) {
          contentlistTem = []
        }
        var bookList = res.data.data.shop
        if (bookList.length < self.data.callbackcount) {
          self.setData({
            'topInfo': res.data.data.info,
            'bookList': contentlistTem.concat(bookList),
            'hasMoreData': false
          })
        } else {
          self.setData({
            'topInfo': res.data.data.info,
            'bookList': contentlistTem.concat(bookList),
            'hasMoreData': true,
            'page': self.data.page + 1
          })
          console.log('分页加载', self.data.bookList)
        }
      }
    })
  },
  // 书本详情跳转
  toBookDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/readingMall/groupBookDetail/groupBookDetail?id=' + id,
    })
  },
})