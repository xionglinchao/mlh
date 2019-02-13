const app = getApp()

Page({
  data: {

  },
  onLoad: function(options) {
    this.setData({
      's_id': options.s_id || null, // 商品分类id
      'shop_label': options.shop_label || null, // 商品标签id
      'price': options.price || null // 价格id
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getSelectedPageInfo()
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
  // 获取筛选结果页面信息
  getSelectedPageInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Shop/screen_lists`,
      data = {}
    if (this.data.s_id != 'undefined') {
      data.s_id = this.data.s_id
    }
    if (this.data.shop_label != 'undefined') {
      data.shop_label = this.data.shop_label
    }
    if (this.data.price != 'undefined') {
      data.price = this.data.price
    }
    console.log(data, '1111111111')
    app.wxRequest(url, data, (res) => {
      console.log('筛选', res)
      if (res.data.code == 1) {
        res.data.data.banner.litpic = app.ossImgUrl + res.data.data.banner.litpic
        this.setData({
          'banner': res.data.data.banner,
          'bookList': res.data.data.shop
        })
      }
    })
  },
  // 书籍详情跳转-团购
  toBookDetail(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.item.id
    let bookType = e.currentTarget.dataset.item.shop_label
    if (bookType == 1) {
      wx.navigateTo({
        url: '/pages/readingMall/groupBookDetail/groupBookDetail?id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/newLibrary/selectedBookInfo/selectedBookInfo?id=' + id,
      })
    }
  },
})