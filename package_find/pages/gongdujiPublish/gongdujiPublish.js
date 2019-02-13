const app = getApp()

Page({
  data: {

  },
  onLoad: function(options) {
    var vision = wx.getStorageSync('vision')
    var system = wx.getStorageSync('system').substr(0,3)
    console.log('system', system)
    this.setData({
      'vision': vision,
      'system': system
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getBasicInfo()
    this.getLocalTime()
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
  getBasicInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Reading/get_info`,
      data = {}
    data = {
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, (res) => {
      console.log('基本信息', res)
      this.setData({
        'userInfo': res.data.data
      })
    })
  },
  // 获取当前系统时间
  getLocalTime() {
    let myDate = new Date();
    let that = this;
    this.setData({
      'year': myDate.getFullYear(),
      'month': myDate.getMonth() + 1,
      'date': myDate.getDate(),
      'day': that.setDay(myDate.getDay())
    })
  },
  setDay(day) {
    let arr = ['日','一','二','三','四','五','六','日'];
    return arr[day];
  },
  // 页面跳转
  toPageAlbumPub() {
    wx.navigateTo({
      url: '/package_find/pages/gongdujiPublish/picturePub/picturePub',
    })
  },
  toPageVideoPub() {
    wx.navigateTo({
      url: '/package_find/pages/gongdujiPublish/videoPub/videoPub',
    })
  },
  toPageCoursePub() {
    if (this.data.userInfo.course_id == 2 || this.data.userInfo.course_id == 3) {
      wx.navigateTo({
        url: '/package_find/pages/gongdujiPublish/ambassador/ambassador?courseId=' + this.data.userInfo.course_id,
      })
    } else {
      wx.navigateTo({
        url: '/package_find/pages/gongdujiPublish/openCourse/openCourse',
      })
    }
  },
  toPageArticlePub() {
    wx.navigateTo({
      url: '/package_find/pages/gongdujiPublish/articlePub/articlePub',
    })
  },
  toPageActivityPub() {
    wx.navigateTo({
      url: '/pages/publish/publish?info=1',
    })
  }
})