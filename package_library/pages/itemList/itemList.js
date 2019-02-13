const app = getApp()

Page({
  data: {
    
  },
  onLoad: function (options) {
    this.setData({
      id: options.id || null  // 二级分类id
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getBookListInfo()
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
  // 获取单品列表详情
  getBookListInfo() {
    let self = this, url = `${app.baseUrl}/interface/Library/book_lists`, data = {}
    data = {
      'id': this.data.id   // 二级分类id
    }
    app.wxRequest(url, data, (res) => {
      console.log('单品列表',res)
      if(res.data.code == 1) {
        res.data.data.logo = app.ossImgUrl + res.data.data.logo
        for(let i = 0; i < res.data.data.lists.length; ++i) {
          res.data.data.lists[i].logo = app.ossImgUrl + res.data.data.lists[i].logo
        }
        this.setData({
          'bookList': res.data.data,
          'seriesList': res.data.data.lists
        })
      }
    })
  },
  // 单本书籍详情跳转
  toBookDetail(e) {
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/package_library/pages/bookLibraryInformation/bookLibraryInformation?id=' + id,
    })
  }
  
})