const app = getApp()

Page({
  data: {
    isCollected: false, // 是否收藏
    tabIndex: 0,  // 选项卡下标
    commentList: [], // 评论列表
    curPage: 1, // 当前加载数据的页数
    callbackcount: 10, //需要返回数据的个数
  },
  onLoad: function (options) {
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
  onReady: function () {

  },
  onShow: function () {
    this.getAudioCourseInfo()
    this.getAudioCourseCommentInfo()
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
  // 选项卡点击事件
  tabClick1() {
    this.setData({
      tabIndex: 0,
    })
  },
  tabClick2() {
    this.setData({
      tabIndex: 1,
    })
  },

  // 顶部作者关注按钮
  subscribeBtnClick(e) {
    // console.log(e)
    let self = this,
      url = `${app.baseUrl}/interface/Personal_center/whether_attention`,
      data = {}
    let item = e.currentTarget.dataset.item, focus = 0
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
      let url2 = `${app.baseUrl}/interface/Course/column_detail`, data = {}
      data = {
        'id': this.data.courseId,
        'openid': app.globalData.openId
      }
      app.wxRequest(url2, data, (res) => {
        this.setData({
          // 'videoCourse': res.data.data,
          // 'course': res.data.data.course,
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
    let id = e.currentTarget.dataset.item.id
    data = {
      'openid': app.globalData.openId,
      'id': id
    }
    app.wxRequest(url, data, function (res) {
      self.setData({
        'isStared': res.data.data.is_collect
      })
      self.getAudioCourseInfo()
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
    })
  },
  
  // 音频课程列别详情
  getAudioCourseInfo() {
    let self = this
    if (!app.globalData.openId) {
      setTimeout(function() {
        self.getAudioCourseInfo()
      }, 500)
      return false
    }
    let url = app.baseUrl + '/interface/Course/column_detail'
    let data = {
      'id': this.data.courseId,
      'openid': app.globalData.openId
    }
    console.log('courseId场景值2222', data)
    app.wxRequest(url, data, (res) => {
      console.log('音频课程类别详情', res)
      if (res.data.err_code == 1) {
        res.data.data.cover_img = app.ossImgUrl + res.data.data.cover_img
        for (let i = 0; i < res.data.data.course.length; ++i) {
          res.data.data.course[i].cover = app.ossImgUrl + res.data.data.course[i].cover
        }
        this.setData({
          'audioCourse': res.data.data,
          'course': res.data.data.course,
          'writer': res.data.data.writer
        })
      }
    })
  },
  // 单个课程详情
  singleAudioCourseClick(e) {
    // console.log(e)
    let list = e.currentTarget.dataset.item
    for (let i = 0; i < list.length; ++i) {
      let singleCourseId = list[i].id
      wx.navigateTo({
        url: '/pages/audioVideoCourse/audioPlay/audioPlay?singleCourseId=' + singleCourseId + '&courseId=' + this.data.courseId + '&buyType=1',
      })
      break
    }
  },
  // 课程列表编辑
  editCourse() {
    wx.navigateTo({
      url: '/pages/personalHomepage/moveCourse/moveCourse?courseId=' + this.data.courseId,
    })
  },
  // 购买分销课程
  buyCourse() {
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
      'order_money': self.data.audioCourse.money,
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

  // 音频课程评论
  getAudioCourseCommentInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/audio_reply`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.courseId,
      'per_page': this.data.curPage,
      'limit': 10,
    }
    app.wxRequest(url, data, (res) => {
      console.log('音频课程评论', res)
      if (res.data.err_code = 1) {
        if (this.data.curPage > 1) {
          var commentList = self.data.commentList
          var resArr = []
          commentList = commentList.concat(res.data.data)
          for (let i = 0; i < res.data.data.length; ++i) {
            resArr.push(res.data.data[i])
            res.data.data[i].likes = res.data.data[i].likes
            res.data.data[i].is_like = res.data.data[i].is_like
          }
          if (resArr.length == 0) {
            // wx.showToast({
            //   icon: 'none',
            //   title: '没有更多内容啦',
            //   duration: 1000
            // })
          }
        } else {
          var commentList = []
          commentList = res.data.data
          for (let i = 0; i < res.data.data.length; ++i) {
            res.data.data[i].likes = res.data.data[i].likes
            res.data.data[i].is_like = res.data.data[i].is_like
          }
        }
        self.setData({
          'commentList': commentList,
        })
        console.log('commentList', commentList)
      }
    })
  },
  // 分页加载
  loadMore() {
    this.data.curPage++
    this.setData({
      'curPage': this.data.curPage
    })
    this.getAudioCourseCommentInfo(this.data.curPage)
  },
  // 获取评论内容
  bindValueInput(e) {
    this.setData({
      'commentContent': e.detail.value,
    })
  },
  // 发送评论
  leaveMessage() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/column_comment`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.courseId,
      'content': self.data.commentContent,
    }
    app.wxRequest(url, data, (res) => {
      console.log('评论结果', res)
      if (res.data.err_code == 1) {
        self.setData({
          curPage: 1,
          toTop: 0
        })
        // 更新页面数据
        this.getAudioCourseCommentInfo()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 评论内容删除功能
  deleteBtnLongPress(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id
    this.setData({
      'discussIndex': id
    })
  },
  // 删除按钮点击隐藏
  longPressBoxHide() {
    this.setData({
      'discussIndex': -1
    })
  },
  // 刪除评论
  delCommentBtn() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/delComment`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'comment_id': this.data.discussIndex
    }
    app.wxRequest(url, data, (res) => {
      console.log('删除', res)
      if (res.data.err_code == 1) {
        wx.showToast({
          title: res.data.msg,
          duration: 1000,
          icon: 'none',
        })
        self.setData({
          curPage: 1,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 1000,
          icon: 'none',
        })
      }
      // 跟新页面数据
      this.getAudioCourseCommentInfo()
    })
  },

  // 头像跳转个人主页
  toPersonalHomepage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + id,
    })
  },

  submit(e) {
    // console.log(e, 11111, e.detail.formId)
    let formId = e.detail.formId
    let self = this, url = `${app.baseUrl}/interface/Reading/get_formId`, data = {}
    data = {
      'form_id': formId,
      'openid': app.globalData.openId,
    }
    app.wxRequest(url, data, (res) => {
      console.log('获取formID', res)
    })
  },
  
})