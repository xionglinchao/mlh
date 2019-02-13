const app = getApp()
const time = require('./time.js')
var WxParse = require('../../../wxParse/wxParse.js')
var innerAudioContext1 // 引导录音管理

Page({
  data: {
    isTabControlHide: 1, // 选项卡内容是否隐藏
    isLiked: false, // 是否点赞
    isFocused: false, // 是否关注
    commentList: [], // 评论列表
    curPage: 1, // 当前加载数据的页数
    callbackcount: 10, //需要返回数据的个数
  },
  onLoad: function(options) {
    let scene = decodeURIComponent(options.scene)
    console.log('场景值', scene)
    if (scene != 'undefined') {
      let sceneId = scene.split('&')[0].split('=')[1]
      var m_id = scene.split('&')[1].split('=')[1]
      var activityId = sceneId
    } else {
      var activityId = options.activityId
    }
    this.setData({
      'activityId': activityId || null,
      'u_id': m_id || options.u_id || null
    })
    innerAudioContext1 = wx.createInnerAudioContext()
    this.bindLowerLevel()
  },
  onReady: function() {

  },
  onShow: function() {
    this.getBasicInfo()
    this.getCommentBasicInfo()
    this.getRelativeBookInfo()
    this.getRelativeCourseInfo()
    let self = this
    setTimeout(function() {
      console.log('2222222', self.data.mine)
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
      console.log('res', res)
      let activityId = res.target.dataset.item.id
      return {
        title: '美丽花亲子时光',
        path: '/package_find/pages/collectedDetail/collectedDetail?activityId=' + activityId + '&u_id=' + this.data.mine,
      }
    }
  },

  // 朋友圈二维码
  friendCircleCode() {
    let self = this,
      url = `${app.baseUrl}/interface/UserInfo/get_code_picture`,
      data = {}
    data = {
      'id': self.data.activityId,
      'type': 4,
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
        setTimeout(function() {
          self.bindLowerLevel()
        }, 2000)
      } else {
        app.wxRequest(url, data, (res) => {
          console.log('绑定上级', res)
        })
      }
    } else {
      console.log('未产生绑定')
    }
  },

  // 播放评论声音
  playCommentAudio(e) {
    let self = this,
      audioIdx = e.currentTarget.dataset.audioIdx,
      audioPath = app.ossImgUrl + e.currentTarget.dataset.audio
    console.log(audioPath)
    // let audioIdx = e.currentTarget.dataset.audioIdx, audioPath = e.currentTarget.dataset.audio
    for (let i = 0; i < self.data.commentList.length; ++i) {
      if (audioIdx == i) {
        self.data.commentList[i].isPlaying = true
        self.setData({
          'commentList': self.data.commentList
        })
        console.log('self.data.commentList[i].isPlaying', self.data.commentList[i].isPlaying)
        innerAudioContext1.autoplay = true
        innerAudioContext1.src = audioPath
        innerAudioContext1.play()
        innerAudioContext1.onPlay(() => {
          innerAudioContext1.offPlay()
          console.log('开始播放评论声音')
        })
        innerAudioContext1.onEnded(() => {
          console.log('引导录音播放完毕')
          innerAudioContext1.offEnded()
          self.data.commentList[i].isPlaying = false
          self.setData({
            'commentList': self.data.commentList
          })
        })
        innerAudioContext1.onError((res) => { // 音频播放失败
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
  // 评论删除按钮
  delClick(e) {
    console.log(e)
    let commentId = e.currentTarget.dataset.item.id
    let self = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除?',
      success: function(res) {
        if (res.confirm) {
          let url = `${app.baseUrl}/interface/Find/del_active_reply`,
            data = {}
          data = {
            'openid': app.globalData.openId,
            'id': commentId
          }
          app.wxRequest(url, data, (res) => {
            console.log('删除', res)
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000,
            })
            // 更新数据
            self.getCommentBasicInfo()
          })
        }
      }
    })
  },
  // 选项卡点击事件
  tabClickBtn1: function() {
    this.data.isTabControlHide = 1
    this.setData({
      'isTabControlHide': this.data.isTabControlHide
    })
  },
  tabClickBtn2: function() {
    this.data.isTabControlHide = 2
    this.setData({
      'isTabControlHide': this.data.isTabControlHide
    })
  },
  tabClickBtn3: function() {
    this.data.isTabControlHide = 3
    this.setData({
      'isTabControlHide': this.data.isTabControlHide
    })
  },

  // 关注
  subscribeBtnClick(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.sucIdx
    let dom = `commentList[${index}].is_focus`
    let focus = item.is_focus === 0 ? 1 : 0
    let url = app.baseUrl + '/interface/Personal_center/whether_attention',
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': item.u_id,
      'type': focus // 1关注 0取消关注
    }
    app.wxRequest(url, data, (res) => [
      that.setData({
        [dom]: focus
      }),
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
    ])
  },
  // 点赞
  likeBtnClick(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.likedIdx
    let dom = `commentList[${index}].whether_like`
    let domNum = `commentList[${index}].likes`
    let like = item.whether_like === 0 ? 1 : 0
    let likes = item.whether_like == 1 ? Number(item.likes) - 1 : Number(item.likes) + 1
    let url = app.globalData.urlApi.setChioceLikes,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': item.id, // 单个评论所在列表中的id
      'type': like // 1点赞 0取消点赞
    }
    app.wxRequest(url, data, (res) => {
      that.setData({
        [dom]: like,
        [domNum]: likes
      }),
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
    })
  },
  // 底部交互栏点赞
  likeClick: function() {
    let self = this,
      url = app.baseUrl + '/interface/Find/activity_like',
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.activityId,
    }
    app.wxRequest(url, data, (res) => {
      console.log('活动点赞', res)
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000,
      })
      // 更新页面数据
      self.getBasicInfo()
    })
  },
  // 第一个关注
  focusClick: function(e) {
    // console.log(e)
    let self = this,
      url = app.baseUrl + '/interface/Personal_center/whether_attention',
      data = {}
    let item = e.currentTarget.dataset.item,
      focus = 0
    if (item.sigin_attention == 1) {
      focus = 0
    } else {
      focus = 1
    }
    data = {
      'openid': app.globalData.openId,
      'id': item.u_id,
      'type': focus // 1关注 0取消关注
    }
    app.wxRequest(url, data, (res) => {
      console.log('关注按钮', res.data.msg)
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
    })
  },

  // 获取页面信息
  getBasicInfo() {
    let self = this,
      url = app.baseUrl + '/interface/Find/activity_detail',
      data = {
        'openid': app.globalData.openId,
        'id': this.data.activityId,
        // 'id': 22
      }
    app.wxRequest(url, data, (res) => {
      console.log('征集详情', res)
      if (res.data.code == 1) {
        let myDate = +(new Date())
        // let endTime = + (new Date(res.data.data.end_time))
        let endTime1 = res.data.data.end_time.replace(/\-/g, "/")
        let endTime = +(new Date(endTime1))
        res.data.data.litpic = app.ossImgUrl + res.data.data.litpic
        if (myDate < endTime) {
          res.data.data.countDownText = self.addUnique(time.calculByEndDate(res.data.data.end_time))
        }
        // res.data.data.content
        res.data.data.like = res.data.data.like
        res.data.data.whether_like = res.data.data.whether_like
        let article = res.data.data.content
        WxParse.wxParse('article', 'html', article, self, 5)
        self.setData({
          'activiDetail': res.data.data,
          'countDownText': res.data.data.countDownText ? res.data.data.countDownText : [],
          'publisher': res.data.data.publisher ? res.data.data.publisher : '',
          'mine': res.data.data.mine,
        })
        console.log('mine', this.data.mine)
        if (myDate < endTime) {
          setInterval(() => {
            res.data.data.countDownText = self.addUnique(time.calculByEndDate(res.data.data.end_time))
            self.setData({
              'countDownText': res.data.data.countDownText
            })
          }, 1000)
        }
      }
    })
  },
  /**
   * 设置 wx:key 来指定列表中项目的唯一的标识符，提高渲染效率，解决waring
   * @params {String} ct counttime字符串 "dd:hh:mm:ss"
   */
  addUnique(ct) {
    return ct = ct.split('').map((n, idx) => Object.assign({}, {
      'text': n,
      'unique': `unique_${idx}`,
    }))
  },

  // 获取参与展示页面信息
  getCommentBasicInfo() {
    let self = this,
      url = app.baseUrl + '/interface/Find/active_reply',
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': self.data.activityId,
      'per_page': self.data.curPage
    }
    app.wxRequest(url, data, (res) => {
      console.log('参与展示', res)
      if (res.data.code == 1) {
        for (let i = 0; i < res.data.data.length; ++i) {
          res.data.data[i].isPlaying = false
        }
        if (self.data.curPage > 1) {
          var commentList = self.data.commentList
          commentList = commentList.concat(res.data.data)
        } else {
          var commentList = []
          commentList = res.data.data
        }
        self.setData({
          'commentList': commentList,
        })
        console.log('commentList', commentList)
      }
    })
  },

  // 评论图片预览
  previewImage(e) {
    let currentImg = app.ossImgUrl + e.currentTarget.dataset.itemUrl,
      imgArr = e.currentTarget.dataset.itemArr
    for (let i = 0; i < imgArr.length; ++i) {
      imgArr[i] = app.ossImgUrl + imgArr[i]
    }
    wx.previewImage({
      current: currentImg, // 当前显示图片的http链接
      urls: imgArr  // 需要预览的图片http链接列表
    })
  },

  // 分页加载
  loadMore() {
    this.data.curPage++
      this.setData({
        'curPage': this.data.curPage
      })
    this.getCommentBasicInfo(this.data.curPage)
  },
  // 征集内容二级评论
  btn_erjipinglun(e) {
    // console.log(e)
    let item = e.currentTarget.dataset.item
    var parameterStrng = '?typeNum=' + 5 + '&typeInfo=' + item.id + '&id=' + this.data.activityId
    app.navigateWx(this, '/package_find/pages/choiceRecruitComment/choiceRecruitComment', parameterStrng)
  },

  // 获取相关书籍页面信息
  getRelativeBookInfo() {
    let self = this,
      url = app.baseUrl + '/interface/Find/related_book',
      data = {}
    data = {
      'id': this.data.activityId
    }
    app.wxRequest(url, data, (res) => {
      console.log('相关书籍', res)
      if (res.data.code == 1) {
        this.setData({
          'relationBooksList': res.data.data
        })
      }
    })
  },
  // 获取相关课程页面信息
  getRelativeCourseInfo() {
    let self = this,
      url = app.baseUrl + '/interface/Find/related_course',
      data = {}
    data = {
      'id': this.data.activityId
    }
    app.wxRequest(url, data, (res) => {
      console.log('相关课程', res)
      if (res.data.code == 1) {
        this.setData({
          'relationCourseList': res.data.data
        })
      }
    })
  },
  // 相关课程页面跳转
  toCourseDetail(e) {
    let courseId = e.currentTarget.dataset.item.id
    let courseType = e.currentTarget.dataset.item.course_type
    if (courseType == 1) {
      wx.navigateTo({
        url: '/pages/audioVideoCourse/videoCourse/videoCourse?courseId=' + courseId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/audioVideoCourse/audioCourse/audioCourse?courseId=' + courseId,
      })
    }
  },
  // 一级评论
  firstComment(e) {
    // console.log(e)
    if (this.data.countDownText.length > 0) {
      let plType = Number(e.currentTarget.dataset.item.type)
      if (plType == 1 || plType == 2) {
        var parameterStrng = '?typeNum=' + plType + '&id=' + this.data.activityId + '&typeInfo=0'
        app.navigateWx(this, '/package_find/pages/choiceRecruitComment/choiceRecruitComment', parameterStrng)
      } else if (plType == 3) {
        wx.navigateTo({
          url: '/package_find/pages/yuyinzhengji/yuyinzhengji?com_id=' + this.data.activityId,
        })
      } else if (plType == 4) {
        wx.navigateTo({
          url: '/package_find/pages/videozhengji/videozhengji?com_id=' + this.data.activityId,
        })
      }
    } else {
      wx.showToast({
        title: '活动已结束',
        icon: 'none',
        duration: 1000
      })
    }
  },
  // 返回首页
  toHomePage() {
    wx.reLaunch({
      url: '/pages/homepage/homepage',
    })
  },
  // 相关书籍详情及购买
  toBookDetail(e) {
    console.log(e)
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/newLibrary/selectedBookInfo/selectedBookInfo?id=' + id,
    })
  },
  // 个人主页跳转
  toPersonalPage(e) {
    console.log(e)
    let id = e.currentTarget.dataset.item.u_id
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + id,
    })
  },
  // 播放视频
  videoPlay(e) {
    let videoPlay = e.currentTarget.dataset.video
    wx.navigateTo({
      url: '/pages/videoPlay/videoPlay?videoPlay=' + videoPlay,
    })
  },

  //显示对话框
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
  // 参与人列表
  toJoinPeople(e) {
    let activityId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/package_find/pages/joinPeople/joinPeople?activityId=' + activityId,
    })
  }
})