const app = getApp()

Page({
  data: {
    // 视频课程列表
    videoCourseList: [],
  },
  onLoad: function(options) {
    // this.setData({
    //   courseId: options.courseId || null,
    //   isMine: options.isMine || null,
    //   identityId: options.identityId || null,
    //   userId: options.userId || null
    // })
    let scene = decodeURIComponent(options.scene)
    console.log('场景值', scene)
    if (scene != 'undefined') {
      let sceneId = scene.split('&')[0].split('=')[1]
      var courseId = sceneId
    } else {
      var courseId = options.courseId
    }
    console.log('courseId场景值', courseId)
    this.setData({
      'courseId': courseId || null,
      // 'u_id': m_id || options.u_id || null
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getViderCourseInfo()
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
  // 顶部作者关注按钮
  subscribeBtnClick(e) {
    // console.log(e)
    let self = this,
      url = `${app.baseUrl}/interface/Personal_center/whether_attention`,
      data = {}
    let item = e.currentTarget.dataset.item,
      focus = 0
    if (item.is_focus == 0) {
      focus = 1
    } else {
      focus = 0
    }
    data = {
      'openid': app.globalData.openId,
      'id': item.id,
      'type': focus // 1关注 0取消关注
    }
    app.wxRequest(url, data, (res) => {
      console.log('关注按钮', res)
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
      // 更新页面数据
      let url2 = `${app.baseUrl}/interface/Course/column_detail`,
        data = {}
      data = {
        'id': this.data.courseId,
        'openid': app.globalData.openId
      }
      app.wxRequest(url2, data, (res) => {
        this.setData({
          'writer': res.data.data.writer
        })
      })
    })
  },

  // 收藏按钮点击事件
  collectionBtnClick(e) {
    console.log(e)
    let self = this,
      url = `${app.baseUrl}/interface/Course/collect_column`,
      data = {}
    let courseId = e.currentTarget.dataset.item.id
    data = {
      'openid': app.globalData.openId,
      'id': courseId
    }
    app.wxRequest(url, data, function(res) {
      self.setData({
        'isStared': res.data.data.is_collect
      })
      self.getViderCourseInfo()
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
    })
  },

  // 视频课程类别详情
  getViderCourseInfo() {
    let self = this
    if (!app.globalData.openId) {
      setTimeout(function() {
        self.getViderCourseInfo()
      }, 500)
      return false
    }
    let system = wx.getStorageSync('system').substr(0, 3)
    let url = app.baseUrl + '/interface/Course/column_detail'
    let data = {
      'id': this.data.courseId,
      'openid': app.globalData.openId
    }
    console.log('courseId场景值2222', data)
    app.wxRequest(url, data, (res) => {
      console.log('视频课程类别详情', res)
      if (res.data.err_code == 1) {
        res.data.data.cover_img = app.ossImgUrl + res.data.data.cover_img
        // res.data.data.course.cover = app.ossImgUrl + res.data.data.course.cover
        for (let i = 0; i < res.data.data.course.length; ++i) {
          res.data.data.course[i].cover = app.ossImgUrl + res.data.data.course[i].cover
        }
        this.setData({
          'videoCourse': res.data.data,
          'course': res.data.data.course,
          'writer': res.data.data.writer,
          'system': system
        })
      }
    })
  },


  // 单个课程详情
  singleVideoCourseClick(e) {
    // console.log(e)
    let singleCourseId = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/audioVideoCourse/videoPlay/videoPlay?singleCourseId=' + singleCourseId + '&courseId=' + this.data.courseId,
    })
  },
  // 课程列表编辑
  editCourse() {
    wx.navigateTo({
      url: '/pages/personalHomepage/moveCourse/moveCourse?courseId=' + this.data.courseId,
    })
  },
  // 购买课程
  buyCourseList() {
    
    let self = this,
      url = app.baseUrl + '/interface/Pay/purchaseColumn',
      data = {}
    let distribute_id = self.data.identityId
    if (distribute_id == 1) {
      distribute_id = 0
    } else {
      distribute_id = self.data.userId
    }
    data = {
      'id': this.data.courseId,
      'openid': app.globalData.openId,
      'type': 0,
      'order_money': self.data.videoCourse.money,
      'c_id': 0,
      'distribute_id': distribute_id
    }
    app.wxRequest(url, data, (res) => {
      console.log('购买课程', res)
      if (res.data.code == 1) {
        var item = res.data.msg.config
        wx.requestPayment({
          'timeStamp': item.timestamp,
          'nonceStr': item.nonceStr,
          'package': item.package,
          'signType': item.signType,
          'paySign': item.paySign,
          'success': function (result) {
            wx.showModal({
              title: '购买成功',
              content: '请前往我的课程查看！',
            })
          },
          'fail': function (result) {
            console.log(result, 3132131312313131)
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },

  // 头像跳转个人主页
  toPersonalHomepage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + id,
    })
  }

})