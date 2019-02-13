const app = getApp()

Page({
  data: {
    isLockBoxHide: true, // 解锁弹窗隐藏
    isCollection: false, // 是否收藏
    isPlaying: false, // 是否正在播放
  },
  onLoad: function(options) {
    this.setData({
      'singleCourseId': options.singleCourseId || null
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getSingleCourseInfo()
    this.getAudioCourseCommentInfo()
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
  //显示评论列表
  showModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏评论列表
  hideModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  // 解锁点击事件
  unlockBtnClick() {
    this.setData({
      'isLockBoxHide': !this.data.isLockBoxHide
    })
  },
  // 解锁关闭事件
  unlockHidePopup() {
    this.setData({
      'isLockBoxHide': !this.data.isLockBoxHide
    })
  },

  // 收藏按钮点击事件
  collectionBtnClick() {
    this.setData({
      'isCollection': !this.data.isCollection
    })
  },
  // 语音播放
  audioPlayClick() {
    this.setData({
      'isPlaying': !this.data.isPlaying
    })
  },

  // 获取单个音频课程详情
  getSingleCourseInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/show_course`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.singleCourseId
    }
    app.wxRequest(url, data, (res) => {
      console.log('音频', res)
      if (res.data.err_code == 1) {
        res.data.data.cover = app.ossImgUrl + res.data.data.cover
        this.setData({
          'audioCourse': res.data.data
        })
      }
    })
  },
  // 音频课程评论
  getAudioCourseCommentInfo() {
    let self = this, url = `${app.baseUrl}/interface/Course/showCourseComment`, data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.singleCourseId,
      'per_page': page,
      'limit': 10,
    }
    app.wxRequest(url, data, (res) => {
      console.log('音频课程评论',res)
      for(let i = 0; i < res.data.data.length; ++i) {
        res.data.data[i].likes = res.data.data[i].likes
        res.data.data[i].is_like = res.data.data[i].is_like
      }
      this.setData({
        'commentList': res.data.data
      })
    })
  },
  // 发布评论
  bindValueInput(e) {
    let self = this, url = `${app.baseUrl}/interface/Course/comment`, data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.singleCourseId,
      'content': e.detail.value,
      // 'video': '',
      // 'audio_duration': -1
    }
    app.wxRequest(url, data, (res) => {
      console.log('评论结果',res.data.msg)
      // 更新页面数据
      this.getAudioCourseCommentInfo()
    })
  },
  // 删除评论
  delBtnClick(e) {
    // console.log(e)
    let commendId = e.currentTarget.dataset.item.id
    let self = this, url = `${app.baseUrl}/interface/Course/delComment`, data = {}
    data = {
      'openid': app.globalData.openId,
      'comment_id': commendId
    }
    app.wxRequest(url, data, (res) => {
      console.log('删除',res.data.msg)
      // 更新页面数据
      this.getAudioCourseCommentInfo()
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
    })
  },
  // 课程评价点赞与取消
  likeBtnClick(e) {
    // console.log(e)
    let item = e.currentTarget.dataset.item, like = 0
    let self = this, url = `${app.baseUrl}/interface/Course/likeComment`, data = {}
    if(item.is_like == 0) {
      like = 1
    } else {
      like = 0
    }
    data = {
      'id': item.id,
      'openid': app.globalData.openId,
      'type': like
    }
    app.wxRequest(url, data, (res) => {
      console.log('点赞',res.data.msg)
      // 更新页面数据
      self.getAudioCourseCommentInfo()
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
    })
  },
})