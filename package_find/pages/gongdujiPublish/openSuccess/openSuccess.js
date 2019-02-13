const app = getApp()
Page({
  data: {
    isCheckedHide: true, // 是否隐藏同意协议
    // 课程特色服务
    listBox: [
      '绑定手机，申请专属课程服务（已绑定的用户不用绑了）',
      '绑定手机，',
      '绑定手机，申请专属课程服务',
    ],
    // 如何进行开课
    listBox2: [
      '绑定手机，申请专属课程服务（已绑定的用户不用绑了）',
      '绑定手机，',
      '绑定手机，申请专属课程服务',
    ],
    info: ""
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
  // 协议点击事件
  checkClick: function () {
    let isCheckedHide = !this.data.isCheckedHide
    this.setData({
      'isCheckedHide': isCheckedHide
    })
  },
  // 点击开通课程
  openCourseClick: function () {
    if (this.data.isCheckedHide == false) {
      this.setData({
        'isOpenCourse': true
      })
    } else {
      wx.showToast({
        title: '还未同意协议',
        icon: 'none',
        duration: 2000,
      })
    }
  },
  getMessage() {
    var that = this
    var url = app.baseUrl + '/interface/Reading/open_course', data = {}
    app.wxRequest(url, data, function (res) {
      if (res.data.code == 1) {
        var info = res.data.data;
        that.setData({
          info: info
        })
      }
    })
  },
})