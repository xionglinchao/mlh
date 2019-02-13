const app = getApp()

Page({
  data: {
    'course_type': -1
  },
  onLoad: function(options) {
    this.setData({
      userId: options.userId || null, // 被查看人id
      courseArrId: options.courseArrId || null, // 需移动的课程id
      courseType: options.courseType || null, // 需移动的课程类型
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getCourseListInfo()
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
  // 我的课程单个选择
  singleClick(e) {
    // console.log(e)
    let courseTypeId = e.currentTarget.dataset.item.id
    let idx = e.currentTarget.dataset.idx
    for (let i = 0; i < this.data.courseList.length; ++i) {
      if (idx == i) {
        this.data.courseList[i].is_selected = true
        this.data.course_type = this.data.courseList[i].course_type
      } else {
        this.data.courseList[i].is_selected = false
      }
    }
    this.setData({
      'courseList': this.data.courseList,
      'courseTypeId': courseTypeId,
      'course_type': this.data.course_type
    })
  },
  // 获取课程列表信息
  getCourseListInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Home_page/course`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.userId // 被查看人id
    }
    app.wxRequest(url, data, (res) => {
      console.log('课程列表', res)
      if (res.data.code == 1) {
        for (let i = 0; i < res.data.data.lists.length; ++i) {
          res.data.data.lists[i].is_selected = false
        }
        self.setData({
          'writer': res.data.data.writer,
          'courseList': res.data.data.lists,
        })
      }
    })
  },
  // 确认移动
  confirmMoveClick() {
    if (this.data.courseType == this.data.course_type) {
      let self = this,
        url = `${app.baseUrl}/interface/Home_page/edit_course`,
        data = {}
      data = {
        'openid': app.globalData.openId,
        'course_id': this.data.courseArrId,
        'column_id': this.data.courseTypeId
      }
      app.wxRequest(url, data, (res) => {
        console.log(res.data.msg)
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 3
          })
        },2000)
      })
    } else {
      wx.showToast({
        title: '请选择正确的类目',
        icon: 'none',
        duration: 1000
      })
    }
  }
})