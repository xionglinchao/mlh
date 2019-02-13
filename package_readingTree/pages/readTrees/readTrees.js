const app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {
    this.getGameList()
  },
  onReady: function () {

  },
  onShow: function () {

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
  getGameList() {
    let url = app.baseUrl + '/Api/Games/lists'
    app.wxRequest(url, {}, function (res) {
      console.log('获取游戏列表', res)
    })
  },
  toPage() {
    wx.navigateTo({
      url: '/package_readingTree/pages/readTrees/funGame/ciyubaida/cybd',
    })
  }
})