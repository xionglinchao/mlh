const app = getApp()

Page({
  data: {
    isHideChooseDot: true, // 是否隐藏选择按钮
    isChooseMyCourse: true, // 是否选择我的课程内容
    courseArr: [],
  },
  onLoad: function(options) {
    this.setData({
      courseId: options.courseId || null
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.setData({
      courseArr: []
    })
    this.getCourseTypeInfo()
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
  // 已购课程单个选择
  singleClick(e) {
    let courseArr = []
    let idx = e.currentTarget.dataset.idx;
    for (var i = 0; i < this.data.course.length; ++i) {
      if (idx == i) { // 判断当前是哪个按钮
        this.data.course[i].is_selected = !this.data.course[i].is_selected
      }
      this.data.course[i].is_selected ? courseArr.push(this.data.course[i].id) : courseArr
    }
    console.log(courseArr)
    this.setData({
      'course': this.data.course,
      'courseArr': courseArr
    })
  },
  // 获取课程类别详情
  getCourseTypeInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/column_detail`,
      data = {}
    data = {
      'id': this.data.courseId,
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, (res) => {
      console.log('目录', res)
      if (res.data.err_code == 1) {
        res.data.data.cover_img = app.ossImgUrl + res.data.data.cover_img
        for (let i = 0; i < res.data.data.course.length; ++i) {
          res.data.data.course[i].cover = app.ossImgUrl + res.data.data.course[i].cover
          res.data.data.course[i].is_selected = false
        }

        this.setData({
          'course': res.data.data.course,
          'userId': res.data.data.u_id,
          'courseType': res.data.data.course_type
        })
      }
    })
  },
  // 取消按钮
  cancelBtnClick() {
    wx.navigateBack()
  },
  // 移动按钮
  moveBtnClick() {
    console.log(this.data.courseArr.length)
    if (this.data.courseArr.length == 0) {
      wx.showToast({
        title: '请选择课程',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.navigateTo({
        url: '/pages/personalHomepage/moveToMyCourse/moveToMyCourse?userId=' + this.data.userId + "&courseArrId=" + this.data.courseArr + "&courseType=" + this.data.courseType,
      })
    }
  }
})