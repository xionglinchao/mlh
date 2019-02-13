var WxParse = require('../../../wxParse/wxParse.js')
const app = getApp()
const recorderManager = wx.getRecorderManager() // 录音发布管理
const innerAudioContext1 = wx.createInnerAudioContext() // 引导录音管理
const innerAudioContext3 = wx.createInnerAudioContext() // 发布录音声音管理
const innerAudioContext4 = wx.createInnerAudioContext() // 评论声音管理

Page({
  data: {
    isPlay: false,
    prevPageStatus: false,
    discussIndex: -1, // 选择评论下标
    tabControlIndex: 0, // 选项卡下标 0 详情 1 评论 2 相关书籍
    isLockBoxHide: false, // 解锁弹窗隐藏
    isCollection: false, // 是否收藏
    isHideDeleteBtn: true, // 是否隐藏评论内容删除按钮
    commentList: [], // 评论列表
    curPage: 1, // 当前加载数据的页数
    callbackcount: 10, //需要返回数据的个数

    guideAudio: { // 引导录音
      isPlaying: false, // 是否正在播放
      path: '', // 路径
      duration: 40 // 时长
    },
    voiceSub: { // 声音辅助动画
      duration: '0', // 时长
      isHide: true, // 是否隐藏
      idx: 1, // 帧
      timer: null // 定时器
    },
    recordScope: false, // 是否已经录音授权
    isRecording: true, // 是否正在录音
    isRecPlaying: false, // 是否在播放录制的录音
    audioTempath: '', // 录音文件地址
    audiotimer: null, // 录音动画的定时器
    isPublishing: false, // 是否在发布
    isSubTextHide: true,
    u_id: 0, // 分销者id
    inputValue: '',   // 输入框内容
  },
  onLoad: function(options) {
    let scene = decodeURIComponent(options.scene)
    console.log('场景值', scene)
    if (scene != 'undefined') {
      let sceneId = scene.split('&')[0].split('=')[1]
      let m_id = scene.split('&')[1].split('=')[1]
      let singleCourseId = sceneId
      this.setData({
        'singleCourseId': singleCourseId || null,
        'courseId': options.courseId || null,
        'identityId': options.identityId || null,
        'userId': options.userId || null,
        'mine': m_id || options.mine || null
      })
    } else {
      this.setData({
        'singleCourseId': options.singleCourseId || null,
        'courseId': options.courseId || null,
        'identityId': options.identityId || null,
        'userId': options.userId || null,
        'mine': options.mine || null
      })
    }
    console.log('singleCourseId3333333333', this.data.singleCourseId)
    this.bindLowerLevel()
  },
  onReady: function() {
    recorderManager.onStart(() => {
      console.log('开始录音zhong.....')
      wx.showLoading({
        title: '录音中...',
      })
    })
    recorderManager.onError((res) => {
      console.log('录音失败', res)
    })
    recorderManager.onStop((res) => {
      console.log('结束录音', res)
      var that = this
      wx.hideLoading()
      if (res.duration < 1000) {
        wx.showToast({
          title: '录音时间太短',
          icon: 'none',
          mask: true
        })
        return
      }
      that.setData({
        'audioTempath': res.tempFilePath,
        'audioDuration': res.duration,
        'isRecording': false
      })
      let url = `${app.baseUrl}/interface/Course/comment`,
        data = {}
      var audioTempath = res.tempFilePath
      var duration = res.duration
      wx.uploadFile({ // 上传录音文件
        url: app.globalData.urlApi.edit_audio,
        filePath: audioTempath, // 临时路径
        name: 'file',
        success: function(res) {
          // console.log(res)
          var dataName = JSON.parse(JSON.stringify(that.trimKong(res.data))) // 解析返回json字符串
          console.log('111111', dataName)
          data = {
            'openid': app.globalData.openId,
            'id': that.data.singleCourseId,
            'video': audioTempath,
            'audio_duration': that.data.audioDuration
          }
          app.wxRequest(url, data, (res) => {
            console.log('语音评论', data)
            // 更新页面数据
            that.getCourseCommentInfo()
          })
        }
      })
    })
  },
  onShow: function() {
    this.getSingleCourseInfo()
    this.getCourseCommentInfo()
    this.getShowModalInfo()
    let self = this
    setTimeout(function() {
      console.log('1111111111', self.data.mine)
      self.friendCircleCode()
    }, 500)

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
        path: '/pages/audioVideoCourse/videoPlay/videoPlay?singleCourseId=' + this.data.singleCourseId + '&mine=' + this.data.mine,
      }
    }
  },
  // 朋友圈二维码
  friendCircleCode() {
    let self = this,
      url = `${app.baseUrl}/interface/UserInfo/get_code_picture`,
      data = {}
    data = {
      'id': self.data.singleCourseId,
      'type': 6,
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
      self.hideModal2()
      setTimeout(function() {
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
      self.hideModal2()
    }
  },

  // 绑定上级
  bindLowerLevel() {
    if (this.data.mine) {
      let self = this,
        url = `${app.baseUrl}/interface/UserInfo/user_bind_bdistribution`,
        data = {}
      data = {
        'open_id': app.globalData.openId,
        'u_id': self.data.mine
      }
      console.log('app.globalData.openId', app.globalData.openId, self.data.bind_open_id)
      if (!app.globalData.openId || app.globalData.openId === 'null') {
        setTimeout(function() {
          self.bindLowerLevel()
        }, 2000)
      } else {
        app.wxRequest(url, data, (res) => {
          console.log('绑定上级', res)
        })
      }
    }
  },


  // 语音字符串拼接
  trimKong: function(s) { //
    return JSON.parse(trim(s))
    function trim(str) {
      str = str.replace(/^(\s|\u00A0)+/, '')
      for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
          str = str.substring(0, i + 1)
          break
        }
      }
      return str
    }
  },
  startVoice() {
    let options = { // 录音配置项
      'duration': 20000,
      'sampleRate': 16000,
      'numberOfChannels': 1,
      'encodeBitRate': 96000,
      'format': 'mp3',
      'frameSize': 50
    }
    console.log('开始录音')
    recorderManager.start(options)
  },
  stopVoice() {
    recorderManager.stop()
    wx.showLoading({
      title: '正在发布',
    })
  },
  // 播放评论声音
  playCommentAudio(e) {
    let self = this,
      audioIdx = e.currentTarget.dataset.audioIdx,
      audioPath = e.currentTarget.dataset.audio
    console.log(audioPath)
    for (let i = 0; i < self.data.commentList.length; ++i) {
      if (audioIdx == i) {
        self.data.commentList[i].isPlaying = true
        self.setData({
          'commentList': self.data.commentList
        })
        innerAudioContext4.autoplay = true
        innerAudioContext4.src = audioPath
        console.log('开始播放评论声音')
        innerAudioContext4.play()
        // 停止其他声音
        innerAudioContext1.stop()
        innerAudioContext3.stop()
        // 停止引导声音及录制录音动画
        clearInterval(self.data.audiotimer) // 录制录音播放动画定时器
        self.setData({
          'isRecPlaying': false
        })
        // innerAudioContext4.onPlay(() => {
        // })
        innerAudioContext4.onEnded(() => {
          console.log('评论播放完毕')
          innerAudioContext4.offEnded()
          // clearInterval(this.data.audiotimer)
          self.data.commentList[i].isPlaying = false
          self.setData({
            'commentList': self.data.commentList
          })
        })
        innerAudioContext4.onError((res) => { // 音频播放失败
          console.log(res.errMsg)
          console.log(res.errCode)
        })
      } else {
        self.data.commentList[i].isPlaying = false
        self.setData({
          'commentList': self.data.commentList
        })
      }
    }
  },
  //显示课程期数列表
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
  //隐藏对话框
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
  // 获取目录列表信息
  getShowModalInfo() {
    let system = wx.getStorageSync('system').substr(0, 3)
    let self = this,
      url = `${app.baseUrl}/interface/Course/column_detail`,
      data = {}
    data = {
      'id': self.data.courseId,
      'openid': app.globalData.openId,
      'system': system
    }
    app.wxRequest(url, data, (res) => {
      console.log('目录', res)
      if (res.data.err_code == 1) {
        self.setData({
          'course': res.data.data.course,
          'u_id': res.data.data.u_id,
          'mine': res.data.data.mine,
          'system': system
        })
      }
    })
  },
  // 目录单个课程跳转
  toSingleCourse(e) {
    let singleCourseId = e.currentTarget.dataset.id
    wx.redirectTo({
      url: '/pages/audioVideoCourse/videoPlay/videoPlay?singleCourseId=' + singleCourseId + '&courseId=' + this.data.courseId,
    })
  },

  // 选项卡点击事件
  tabControlClick1() {
    this.setData({
      "tabControlIndex": 0
    })
  },
  tabControlClick2() {
    this.setData({
      "tabControlIndex": 1
    })
  },
  tabControlClick3() {
    this.setData({
      "tabControlIndex": 2
    })
  },

  // 解锁点击事件
  unlockBtnClick() {
    if (this.data.singleCourse.is_unlock == 0) {
      this.setData({
        isLockBoxHide: !this.data.isLockBoxHide
      })
    } else {
      this.setData({
        isLockBoxHide: false
      })
    }
  },
  // 解锁关闭事件
  unlockHidePopup() {
    this.setData({
      'isLockBoxHide': !this.data.isLockBoxHide
    })
  },

  // 获取单个课程页面详情
  getSingleCourseInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/show_course`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.singleCourseId
    }
    app.wxRequest(url, data, (res) => {
      console.log('单个课程详情', res)
      if (res.data.err_code == 1) {
        res.data.data.cover = app.ossImgUrl + res.data.data.cover
        let article = res.data.data.detail
        WxParse.wxParse('article', 'html', article, self, 5)
        this.setData({
          'singleCourse': res.data.data,
          'writer': res.data.data.writer,
          'relativeBook': res.data.data.shop_data
        })
      }
    })
  },

  // 单个课程收藏
  singleCourseCollection() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/collect_course`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.singleCourseId
    }
    app.wxRequest(url, data, (res) => {
      // console.log(res)
      self.setData({
        'isCollected': res.data.data.is_collect
      })
      self.getSingleCourseInfo()
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
    })
  },

  // 查看课程评论
  getCourseCommentInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/showCourseComment`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.singleCourseId,
      'per_page': this.data.curPage,
      'limit': this.data.callbackcount
    }
    app.wxRequest(url, data, (res) => {
      console.log('评论内容', res)
      if (res.data.err_code = 1) {
        if (this.data.curPage > 1) {
          var commentList = self.data.commentList
          var resArr = []
          commentList = commentList.concat(res.data.data)
          for (let i = 0; i < res.data.data.length; ++i) {
            res.data.data[i].isPlaying = false
            resArr.push(res.data.data[i])
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
            res.data.data[i].isPlaying = false
          }
          console.log('commentList', commentList)
        }
        self.setData({
          'commentList': commentList,
        })
      }
    })
  },
  // 加载更多
  loadMore() {
    this.data.curPage++
      this.setData({
        'curPage': this.data.curPage
      })
    this.getCourseCommentInfo(this.data.curPage)
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
      this.getCourseCommentInfo()
    })
  },
  // 发表评论
  bindValueInput(e) {
    // console.log(e)
    let self = this,
      url = `${app.baseUrl}/interface/Course/comment`,
      data = {}
    let inputValue = e.detail.value
    data = {
      'openid': app.globalData.openId,
      'id': this.data.singleCourseId,
      'content': inputValue,
    }
    if (!inputValue) {
      wx.showToast({
        title: '请出入内容',
        icon: 'none',
        duration: 1000,
      })
    } else {
      app.wxRequest(url, data, (res) => {
        console.log('发表评论', res)
        if (res.data.err_code == 1) {
          // 跟新页面数据
          self.setData({
            inputValue: '',
            curPage: 1,
            toTop: 0
          })
          this.getCourseCommentInfo()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
        }
      })
    }
  },
  // 视频播放跳转
  toVideoPlay(e) {
    let self = this
    let is_unlock = e.currentTarget.dataset.lock
    let videoPlay = e.currentTarget.dataset.source
    if (is_unlock) {
      // wx.navigateTo({
      //   url: '/pages/videoPlay/videoPlay?videoPlay=' + videoPlay,
      // })
      self.setData({
        'isPlay': true
      })
    } else if (videoPlay) {
      wx.showModal({
        title: '提示',
        content: '是否播放试看课程?',
        success: function(res) {
          if (res.confirm) {
            // wx.navigateTo({
            //   url: '/pages/videoPlay/videoPlay?videoPlay=' + videoPlay,
            // })
            self.setData({
              'isPlay': true
            })
          }
        }
      })
    } else {
      self.setData({
        isLockBoxHide: !self.data.isLockBoxHide
      })
    }
  },
  // 视频播放结束
  palyEnd() {
    this.setData({
      'isPlay': false
    })
  },
  // 留言
  leaveMessage() {
    this.setData({
      "tabControlIndex": 1
    })
  },


  // 录音授权
  recordAuth() {
    let self = this
    if (self.data.recordScope) {
      self.setData({
        'isSubTextHide': false
      })
      setTimeout(() => {
        self.setData({
          'isSubTextHide': true
        })
      }, 1000)
      return
    }
    wx.authorize({
      scope: 'scope.record',
      success() {
        console.log('录音授权成功')
        self.setData({
          'recordScope': true
        })
      },
      fail() {
        wx.showModal({
          title: '提示',
          content: '您未授权录音，功能将无法使用',
          confirmText: '授权',
          confirmColor: '#1eac58',
          showCancel: false,
          success() {
            self.setData({
              'recordScope': true
            })
            wx.openSetting({})
          }
        })
      }
    })
  },
  // 购买课程
  toBuyCourse() {
    if (this.data.singleCourse.passFree != 0) {
      wx.navigateTo({
        url: '/pages/audioVideoCourse/buyCourse/buyCourse?courseId=' + this.data.singleCourseId + '&type=1',
      })
    }
  },
  // 书详情跳转
  look_detail(e) {
    let id = e.currentTarget.dataset.item.id // 单本书id
    var u_id = this.data.u_id
    // console.log('123123', u_id)
    if (u_id) {
      wx.navigateTo({
        url: '/pages/newLibrary/selectedBookInfo/selectedBookInfo?id=' + id + '&u_id=' + u_id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/newLibrary/selectedBookInfo/selectedBookInfo?id=' + id,
      })
    }
  },
  // 去商城
  toShoppingMall() {
    wx.navigateTo({
      url: '/pages/readingMall/readingMall',
    })
  },

  submit(e) {
    // console.log(e, 11111, e.detail.formId)
    let formId = e.detail.formId
    let self = this,
      url = `${app.baseUrl}/interface/Reading/get_formId`,
      data = {}
    data = {
      'form_id': formId,
      'openid': app.globalData.openId,
    }
    app.wxRequest(url, data, (res) => {
      console.log('获取formID', res)
    })
  },

  //显示对话框
  showModal2: function() {
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
      showModalStatus2: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal2: function() {
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
        showModalStatus2: false
      })
    }.bind(this), 200)
  },
})