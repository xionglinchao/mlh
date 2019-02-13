const app = getApp()

Page({
  data: {

  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.getLibraryInfo()
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
  // 搜索按钮
  searchBtn() {
    wx.navigateTo({
      url: '/pages/libraryClass/searchLibrary/searchLibrary',
    })
  },
  // 获取页面信息
  getLibraryInfo() {
    let self = this, url = `${app.baseUrl}/interface/Library/new_index`, data = {}
    app.wxRequest(url, data, (res) => {
      console.log('文库',res)
      if(res.data.code == 1) {
        for(let i = 0; i < res.data.data.banner.length; ++i) {
          res.data.data.banner[i].value = app.ossImgUrl + res.data.data.banner[i].value
        }
        this.setData({
          'banner': res.data.data.banner,
          'lists': res.data.data.lists,
          'selected': res.data.data.selected,
        })
      }
    })
  },
  // 书籍类别列表跳转
  toMoreBook(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.item.id  // 一级类别id
    wx.navigateTo({
      url: '/package_library/pages/bookSort/bookSort?id=' + id,
    })
  },
  // 文库书籍列表跳转
  toLibraryBookList(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.item.id  // 二级分类id
    wx.navigateTo({
      url: '/package_library/pages/itemList/itemList?id=' + id,
    })
  },
  // 精选书单跳转
  toSelectedBookPage(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/package_library/pages/selectedBookList/selectedBookList?id=' + id,
    })
  }
})