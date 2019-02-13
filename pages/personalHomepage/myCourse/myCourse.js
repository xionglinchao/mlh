const app = getApp()

Page({
  data: {
    isRuleIntroHide: false, // 是否隐藏弹窗
    isHideChooseDot: true, // 是否隐藏选择按钮
    // isHideSelected: true, // 是否隐藏选中点
    isChooseMyCourse: true, // 是否选择我的课程内容
    discussIndex: -1, // 选择课程下标
    allSelected: false, // 是否全部选中

  },
  onLoad: function(options) {
    this.setData({
      userId: options.userId || null  // 被查看人id
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getCourseListInfo()
    this.getBuyCourseInfo()
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
  // 编辑
  editBtnClick() {
    this.setData({
      'isHideChooseDot': !this.data.isHideChooseDot
    })
  },

  // 选项卡
  myCourseClick() {
    this.setData({
      'isChooseMyCourse': true,
      'isHideChooseDot': true,
      'del_num': 0
    })
  },
  buyCourseClick() {
    this.setData({
      'isChooseMyCourse': false,
      'isHideChooseDot': true,
      'del_num': 0
    })
  },
  // 获取课程列表信息
  getCourseListInfo() {
    let self = this, url = `${app.baseUrl}/interface/Home_page/course`, data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.userId    // 被查看人id
    }
    app.wxRequest(url, data, (res) => {
      console.log('课程列表',res)
      if(res.data.code == 1) {
        for(let i = 0; i < res.data.data.lists.length; ++i) {
          res.data.data.lists[i].is_selected = false
        }
        res.data.data.del_num = 0
        self.setData({
          'is_mine': res.data.data.is_mine,
          'writer': res.data.data.writer,
          'courseList': res.data.data.lists,
          'del_num': res.data.data.del_num
        })
      }
    })
  },
  // 我的课程单个选择
  singleClick(e) {
    // console.log(e)
    let courseArr = []
    let delId = e.currentTarget.dataset.item.id
    let idx = e.currentTarget.dataset.idx
    for (let i = 0; i < this.data.courseList.length; ++i) {
      if (idx == i) {
        this.data.courseList[i].is_selected = !this.data.courseList[i].is_selected
        this.data.courseList[i].is_selected ? this.data.del_num++ : this.data.del_num--
      }
      this.data.courseList[i].is_selected ? courseArr.push(this.data.courseList[i].id) : courseArr
    }
    // console.log(courseArr)
    this.setData({
      'courseList': this.data.courseList,
      'del_num': this.data.del_num,
      'courseArr': courseArr
    })
  },
  // 全选
  allChooseClick(e) {
    let courseArr = []
    let status = !this.data.allSelected
    this.data.del_num = status ? this.data.courseList.length : 0
    for (let i of this.data.courseList) {
      status ? i.is_selected = true : i.is_selected = false
      i.is_selected ? courseArr.push(i.id) : courseArr
    }
    console.log('courseArr', courseArr)
    this.setData({
      'courseList': this.data.courseList,
      'del_num': this.data.del_num,
      'allSelected': status,
      'courseArr': courseArr
    })
  },
  // 取消选择
  cancelBtnClick() {
    for (let i = 0; i < this.data.courseList.length; ++i) {
      this.data.courseList[i].is_selected = false
    }
    this.setData({
      'isHideChooseDot': true,
      'courseList': this.data.courseList,
      'del_num': 0
    })
  },
  // 获取已购课程列表信息
  getBuyCourseInfo() {
    let self = this, url = `${app.baseUrl}/interface/Home_page/my_purchase_course`, data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.userId    // 被查看人id
    }
    app.wxRequest(url, data, (res) => {
      console.log('已购课程',res)
      if(res.data.code == 1) {
        this.setData({
          'buyCourse': res.data.data,
        })
      }
    })
  },
  // 课程类别详情跳转
  courseDetaliClick(e) {
    // console.log(e)
    let courseId = e.currentTarget.dataset.item.id
    let courseType = e.currentTarget.dataset.item.course_type
    if (courseType == 1) {
      wx.navigateTo({
        url: '/pages/personalHomepage/videoCourse/videoCourse?courseId=' + courseId + '&isMine=' + this.data.is_mine + '&identityId=' + this.data.writer.course_id + '&userId=' + this.data.userId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/personalHomepage/audioCourse/audioCourse?courseId=' + courseId + '&isMine=' + this.data.is_mine + '&identityId=' + this.data.writer.course_id + '&userId=' + this.data.userId,
      })
    }
  },
  // 删除课程类型
  delBtnClick() {
    let self = this, url = `${app.baseUrl}/interface/Home_page/del_course`, data = {}
    data = {
      'openid': app.globalData.openId,
      'course_id': this.data.courseArr
    }
    app.wxRequest(url, data, (res) => {
      console.log('删除结果',res)
      if(res.data.code == 1) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
        // 更新页面数据
        self.getCourseListInfo()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 分销课程页面跳转
  toDistributeCourse() {
    wx.navigateTo({
      url: '/package_find/pages/gongdujiPublish/distributionCourse/distributionCourse',
    })
  }
})