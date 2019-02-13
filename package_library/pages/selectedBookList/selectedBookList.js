const app = getApp()

Page({
  data: {
    
  },
  onLoad: function (options) {
    this.setData({
      id: options.id || null   // 精选书单id
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getSelectedBookInfo()
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
  // 获取精选书单详情信息
  getSelectedBookInfo() {
    let self = this, url = `${app.baseUrl}/interface/Library/selected_lists`, data = {}
    data = {
      'id': this.data.id
    }
    app.wxRequest(url, data, (res) => {
      console.log('精选书单',res)
      if(res.data.code == 1) {
        for(let i = 0; i < res.data.data.shop.length; ++i) {
          res.data.data.shop[i].litpic = app.ossImgUrl + res.data.data.shop[i].litpic
        }
        this.setData({
          'selectedBook': res.data.data,
          'bookList': res.data.data.shop
        })
      }
    })
  },
  // 书籍详情跳转
  toBookDetail(e) {
    console.log(e)
    let id = e.currentTarget.dataset.item.id  // 商品id
    wx.navigateTo({
      url: '/pages/newLibrary/selectedBookInfo/selectedBookInfo?id=' + id,
    })
  }
})