const app = getApp();

Page({
  data: {
    page: 1, // 当前页码
    callbackcount: 20,  // 展示数量
    contentlist: [],  // 参与列表
  },
  onLoad: function (options) {
    this.setData({
      'activityId': options.activityId || null,
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getJoinPeopleList()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getJoinPeopleList()
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1000
      })
    }
  },
  onShareAppMessage: function () {

  },
  // 参与列表
  getJoinPeopleList() {
    let that = this, url = `${app.baseUrl}/Api/Second_develop/show_more`, data = {}
    data = {
      'openid': app.globalData.openId,
      'id': that.data.activityId,
      'per_page': that.data.page,
      'limit': that.data.callbackcount
    }
    app.wxRequest(url, data, (res) => {
      console.log('参与列表', res)
      if (res.data.code == 1) {
        var contentlistTem = that.data.joinList
        if (that.data.page == 1) {
          contentlistTem = []
        }
        var joinList = res.data.data
        if (joinList.lenght < that.data.callbackcount) {
          that.setData({
            'joinList': contentlistTem.concat(joinList),
            'hasMoreData': false,
          })
        } else {
          that.setData({
            'joinList': contentlistTem.concat(joinList),
            'hasMoreData': true,
            'page': that.data.page + 1,
          })
        }
      }
      console.log('joinList', that.data.joinList)
    })
  },
  // 关注
  subscribeBtnClick(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.sucIdx
    let dom = `joinList[${index}].is_focus`
    let focus = item.is_focus === 0 ? 1 : 0
    let url = app.baseUrl + '/interface/Personal_center/whether_attention',
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': item.u_id,
      'type': focus // 1关注 0取消关注
    }
    app.wxRequest(url, data, (res) => {
      that.setData({
        [dom]: focus
      }),
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
    })
  },
  // 私信
  leaveMessage(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/leaveComments/leaveComments?id=' + id,
    })
  },
  // 个人主页跳转
  toPersonalHomePage(e) {
    let u_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + u_id,
    })
  }
})