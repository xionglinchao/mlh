const app = getApp()
Page({
  data: {
    page: 1,
    pagesize: 10,
    contentlist: []
  },
  onLoad: function (options) {
    this.setData({
      'fansType': options.fansType
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getOrdinaryFans()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getOrdinaryFans()
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
  // 获取绑定的普通用户列表
  getOrdinaryFans() {
    let that = this, url = `${app.baseUrl}/interface/Login/bind_user`, data = {}
    data = {
      'openid': app.globalData.openId,
      'type': that.data.fansType,    // 0绑定的普通用户  1 绑定的推广大使
      'per_page': this.data.page,
      'limit': this.data.pagesize
    }
    app.wxRequest(url, data, (res) => {
      console.log('粉丝列表', res)
      if(res.data.code != 1) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
        return false
      }
      let contentlistTem = that.data.contentlist
      if (that.data.page == 1) {
        contentlistTem = []
      }
      let contentlist = res.data.data
      if (contentlist.length < that.data.pagesize) {
        that.setData({
          'contentlist': contentlistTem.concat(contentlist),
          'hasMoreData': false,
        })
      } else {
        that.setData({
          'contentlist': contentlistTem.concat(contentlist),
          'hasMoreData': true,
          'page': that.data.page + 1
        })
      }
    })
  },
  // 私信
  leaveMessage(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let parameterStrng = '?id=' + id;
    app.navigateWx(this, '../leaveComments/leaveComments', parameterStrng);
  },
  // 查看伙伴详情
  checkBtnClick(e) {
    let userId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/fansListDetail/fansListDetail?userId=' + userId,
    })
  }
})