const app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');

Page({
  data: {
    tabIndex: 0,  // 选项卡下标
  },
  onLoad: function(options) {
    let scene = decodeURIComponent(options.scene)
    console.log('场景值', scene)
    if (scene != 'undefined') {
      let sceneId = scene.split('&')[0].split('=')[1]
      var m_id = scene.split('&')[1].split('=')[1]
      var courseId = sceneId
    } else {
      var courseId = options.courseId
    }
    this.setData({
      'courseId': courseId || null,
      'u_id': m_id || options.u_id || null
    })
    this.bindLowerLevel()
  },
  onReady: function() {

  },
  onShow: function() {
    this.getVideoCourseInfo()
    this.getQuestionInfo()
    let self = this
    setTimeout(function() {
      console.log(self.data.mine)
      self.friendCircleCode()
    },300)
    
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function(res) {
    if (res.from == "button") {
      return {
        title: '美丽花亲子时光',
        path: '/pages/audioVideoCourse/videoCourse/videoCourse?courseId=' + this.data.courseId + '&u_id=' + this.data.mine,
      }
    }
  },

  // 朋友圈二维码
  friendCircleCode() {
    let self = this,
      url = `${app.baseUrl}/interface/UserInfo/get_code_picture`,
      data = {}
    data = {
      'id': self.data.courseId,
      'type': 5,
      'u_id': self.data.mine
    }
    app.wxRequest(url, data, (res) => {
      console.log('朋友圈二维码', res)
      let img_url = app.ossImgUrl + res.data.img_url
      self.setData({
        'img_url': img_url
      })
    })
  },

  // 分享朋友圈
  shareFriendCircle() {
    let self = this
    if (!self.data.img_url) {
      wx.showLoading({
        title: '加载中',
        icon: 'loading'
      })
      self.hideModal()
      setTimeout(function () {
        self.shareFriendCircle()
      }, 2000)
    } else {
      wx.hideLoading()
      let imgArr = []
      let itemUrl = self.data.img_url
      imgArr.push(itemUrl)
      wx.previewImage({
        current: itemUrl, // 当前显示图片的http链接
        urls: imgArr, // 需要预览的图片http链接列表
      })
      console.log('itemUrl', itemUrl)
      self.hideModal()
    }
  },

  // 绑定上级
  bindLowerLevel() {
    if (this.data.u_id) {
      let self = this,
        url = `${app.baseUrl}/interface/UserInfo/user_bind_bdistribution`,
        data = {}
      data = {
        'open_id': app.globalData.openId,
        'u_id': self.data.u_id
      }
      console.log('app.globalData.openId', app.globalData.openId, self.data.bind_open_id)
      if (!app.globalData.openId || app.globalData.openId === 'null') {
        setTimeout(function () {
          self.bindLowerLevel()
        }, 2000)
      } else {
        app.wxRequest(url, data, (res) => {
          console.log('绑定上级', res)
        })
      }
    }
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
        'openid': app.globalData.openId,
        'system': 'iOS'
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
      self.getVideoCourseInfo()
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
    })
  },

  // 视频课程类别详情
  getVideoCourseInfo() {
    var system = wx.getStorageSync('system').substr(0, 3)
    let self = this,
      url = app.baseUrl + '/interface/Course/column_detail',
      data = {}
    data = {
      'id': this.data.courseId,
      'openid': app.globalData.openId,
      'system': system
    }
    app.wxRequest(url, data, (res) => {
      console.log('视频课程类别详情', res)
      if (res.data.err_code == 1) {
        res.data.data.cover_img = app.ossImgUrl + res.data.data.cover_img
        for (let i = 0; i < res.data.data.course.length; ++i) {
          res.data.data.course[i].cover = app.ossImgUrl + res.data.data.course[i].cover
        }
        let article = res.data.data.introduction
        WxParse.wxParse('article', 'html', article, self, 5)
        self.setData({
          'videoCourse': res.data.data,
          'course': res.data.data.course,
          'writer': res.data.data.writer,
          'mine': res.data.data.mine,
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
  // 购买课程
  toBuyCourse() {
    if (this.data.videoCourse.money != 0) {
      wx.navigateTo({
        url: '/pages/audioVideoCourse/buyCourse/buyCourse?courseId=' + this.data.courseId + '&type=0',
      })
    }
  },

  // 头像跳转个人主页
  toPersonalHomepage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + id,
    })
  },

  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  // 新改 提问板块
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
  tabClick3() {
    this.setData({
      tabIndex: 2,
    })
  },

  // 提问列表渲染
  getQuestionInfo() {
    let self = this, url = `${app.baseUrl}/interface/Course/column_audio_list`, data = {}
    data = {
      id: self.data.courseId
    }
    app.wxRequest(url, data, (res) => {
      console.log('提问内容', res)
      if (res.data.err_code == 1) {
        self.setData({
          'questionList': res.data.data,
        })
      }
    })
  },

  // 发布提问按钮跳转
  toAskQuestion() {
    wx.navigateTo({
      url: '/pages/audioVideoCourse/askQuestion/askQuestion?courseId=' + this.data.courseId,
    })
  },
  // 回答按钮跳转
  replyBtnClick(e) {
    let quesId = e.currentTarget.dataset.item.id
    let courseId = e.currentTarget.dataset.item.column_video_id
    wx.navigateTo({
      url: '/pages/audioVideoCourse/replyQuestion/replyQuestion?quesId=' + quesId + '&courseId=' + courseId,
    })
  },
  // 问题详情页跳转
  toQuestionDetail(e) {
    let quesId = e.currentTarget.dataset.item.id
    let courseId = e.currentTarget.dataset.item.column_video_id
    wx.navigateTo({
      url: '/pages/audioVideoCourse/questionDetail/questionDetail?quesId=' + quesId + '&courseId=' + courseId,
    })
  }
})