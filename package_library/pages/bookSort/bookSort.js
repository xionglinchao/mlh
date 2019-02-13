const app = getApp()

Page({
  data: {
    
  },
  onLoad: function (options) {
    this.setData({
      id: options.id || null
    })
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.getBookTypeListInfo()
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
  // 获取页面详情
  getBookTypeListInfo() {
    let self = this, url = `${app.baseUrl}/interface/Library/library_lists`, data = {}
    data = {
      'id': this.data.id
    }
    app.wxRequest(url, data, (res) => {
      console.log('书籍类别列表',res)
      if(res.data.code == 1) {
        for(let i = 0; i < res.data.data.logo.length; ++i) {
          res.data.data.logo[i] = app.ossImgUrl + res.data.data.logo[i]
        }
        this.setData({
          'bookType': res.data.data,
          'swiperPic': res.data.data.logo,
          'booklist': res.data.data.two_lists,
        })
      }
    })
  },
  // 文库书籍列表跳转
  toBookListPage(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.item.id  // 二级分类id
    wx.navigateTo({
      url: '/pages/newLibrary/itemList/itemList?id=' + id,
    })
  }
})