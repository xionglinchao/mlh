const app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {
    this.getMessage()
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

  // 获取合作伙伴信息
  getMessage() {
    var that = this
    var url = app.baseUrl + '/interface/Reading/open_friend', data = {}
    app.wxRequest(url, data, function (res) {
      console.log('合作伙伴', res)
      if (res.data.code == 1) {
        res.data.data.friend_image = app.ossImgUrl + res.data.data.friend_image
        that.setData({
          info: res.data.data
        })
      }
    })
  },

  // 加入合作伙伴
  openCourseClick: function () {
    let self = this, url = `${app.baseUrl}/interface/Pay/to_be_friend`, data = {}
    data = {
      'openid': app.globalData.openId,
    }
    app.wxRequest(url, data, (res) => {
      console.log('加入合作伙伴', res)
      if (res.data.code == 1) {
        var item = res.data.msg.config
        wx.requestPayment({
          'timeStamp': item.timestamp,
          'nonceStr': item.nonceStr,
          'package': item.package,
          'signType': item.signType,
          'paySign': item.paySign,
          'success': function (result) {
            wx.navigateTo({
              url: '/package_find/pages/gongdujiPublish/ambassador/ambassador',
            })
          },
          'fail': function (result) {
            console.log(result, 3132131312313131)
          }
        })
      }
    })
  },
})