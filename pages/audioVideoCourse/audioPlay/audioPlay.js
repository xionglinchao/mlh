const app = getApp()
// const backgroundAudioManager = wx.createbackgroundAudioManager()
const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({
  data: {
    audioIdx: -1, // 当前播放语音下标
    lists: [], // 语音播放列表
    isLockBoxHide: true, // 解锁弹窗隐藏
    isCollection: false, // 是否收藏
    isPlaying: false, // 是否正在播放
    commentList: [], // 评论列表
    curPage: 1, // 当前加载数据的页数
    callbackcount: 10, //需要返回数据的个数
    singleCoursePrice: '',
    curMin: '0',
    curSec: '0',
    isFocus: false,
    comId: 0,
    isShow: false, // 是否显示二级评论
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
      'singleCourseId': options.singleCourseId || null,
      'courseId': courseId || null,
      'identityId': options.identityId || null,
      'userId': options.userId || null,
      'u_id': m_id || options.u_id || null,
      'buyType': options.buyType || null  // 判断是跳转来源 1是H5，不传是小程序
    })
    this.bindLowerLevel()
    console.log('123123123', this.data.userId)
  },
  onReady: function() {

  },
  onShow: function() {
    // this.getSingleCourseInfo()
    this.getAudioCourseCommentInfo()
    this.getAudioListInfo()
    let self = this
    setTimeout(function() {
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
        path: '/pages/audioVideoCourse/audioPlay/audioPlay?courseId=' + this.data.courseId + '&u_id=' + this.data.mine,
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
      'type': 8,
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
    }
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
        showModalStatus: false,
        isFocus: false,
        comId: 0
      })
    }.bind(this), 200)
  },
  // 解锁关闭事件
  unlockHidePopup() {
    this.setData({
      'isLockBoxHide': !this.data.isLockBoxHide
    })
  },

  // 收藏按钮点击事件
  collectionBtnClick() {
    // console.log(e)
    let self = this,
      url = `${app.baseUrl}/interface/Course/collect_column`,
      data = {}
    let id = self.data.courseId
    data = {
      'openid': app.globalData.openId,
      'id': id
    }
    app.wxRequest(url, data, function(res) {
      // 更新页面数据
      self.getAudioListInfo()
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
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
      // 'per_page': this.data.curPage,
      // 'limit': 10,
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
    console.log(e)
    this.setData({
      'commentContent': e.detail.value,
    })
  },
  // 发送评论
  leaveMessage() {
    let self = this
    if (!self.data.commentContent) {
      wx.showToast({
        title: '请输入内容！',
        icon: 'none',
        duration: 1000
      })
    } else {
      let url = `${app.baseUrl}/interface/Course/column_comment`,
        data = {}
      data = {
        'openid': app.globalData.openId,
        'id': this.data.courseId,
        'content': self.data.commentContent,
        'c_others': self.data.comId == 0 ? '0' : self.data.comId
      }
      console.log('self.data.comId', self.data.comId)
      app.wxRequest(url, data, (res) => {
        console.log('评论结果', res)
        if(res.data.err_code == 1) {
          self.setData({
            commentContent: '',
            curPage: 1,
            toTop: 0
          })
          // 更新页面数据
          this.getAudioCourseCommentInfo()
        }
      })
    }
  },
  // 删除评论
  delBtnClick(e) {
    console.log(e)
    let commendId = e.currentTarget.dataset.item.id
    let self = this,
      url = `${app.baseUrl}/interface/Course/delComment`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'comment_id': commendId
    }
    app.wxRequest(url, data, (res) => {
      console.log('删除', res.data.msg)
      self.setData({
        curPage: 1,
      })
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
    let item = e.currentTarget.dataset.item,
      like = 0
    let self = this,
      url = `${app.baseUrl}/interface/Course/likeComment`,
      data = {}
    if (item.is_like == 0) {
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
      console.log('点赞', res.data.msg)
      self.setData({
        curPage: 1,
      })
      // 更新页面数据
      self.getAudioCourseCommentInfo()
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
    })
  },
  // 首页跳转
  toHomepage() {
    wx.reLaunch({
      url: '/pages/homepage/homepage',
    })
  },
  // 语音课程列表
  getAudioListInfo() {
    var system = wx.getStorageSync('system')
    let self = this,
      url = `${app.baseUrl}/interface/Course/audio_lists`,
      data = {}
    data = {
      'column_id': self.data.courseId,
      'openid': app.globalData.openId,
      'singleCourseId': self.data.singleCourseId,
      'system': self.data.buyType == 1 ? '':system
    }
    app.wxRequest(url, data, (res) => {
      console.log('语音课程列表', res)
      if (res.data.code == 1) {
        res.data.data.column.cover_img = app.ossImgUrl + res.data.data.column.cover_img
        for (let i = 0; i < res.data.data.course_lists.length; ++i) {
          res.data.data.course_lists[i].isPlaying = false
          if (res.data.data.course_lists[i].duration) {
            let totalTime = res.data.data.course_lists[i].duration
            var min = Math.floor(totalTime / 60)
            var sec = totalTime % 60
            res.data.data.course_lists[i].min = min
            res.data.data.course_lists[i].sec = sec
          }
        }
        self.setData({
          'audioCourse': res.data.data.column,
          'lists': res.data.data.course_lists,
          'mine': res.data.data.mine
        })
      }
    })
  },
  // 播放语音
  playAudioCourse(e) {
    console.log(e)
    let singleCourseId = e.currentTarget.dataset.item.id
    let singleCoursePrice = e.currentTarget.dataset.item.free
    let courseTitle = e.currentTarget.dataset.item.course_title
    let is_pay = e.currentTarget.dataset.item.is_pay
    if (is_pay) {
      let self = this,
        audioIdx = e.currentTarget.dataset.audioIdx,
        audioPath = app.ossImgUrl + e.currentTarget.dataset.item.course
      console.log('当前音频路径', audioPath, audioIdx)
      self.setData({
        'audioIdx': audioIdx, // 当前播放音频
      })
      console.log('self.data.lists', self.data.lists, audioIdx)
      for (let i = 0; i < self.data.lists.length; i++) {
        if (audioIdx == i) {
          console.log('i', i)
          self.data.lists[i].isPlaying = !self.data.lists[i].isPlaying
          self.setData({
            'lists': self.data.lists,
          })
          if (audioPath != backgroundAudioManager.src) {
            backgroundAudioManager.src = audioPath
            backgroundAudioManager.title = courseTitle
          }
          if (self.data.lists[i].isPlaying) {
            let isPlaying = self.data.lists[i].isPlaying
            backgroundAudioManager.play()
            backgroundAudioManager.onPlay(() => {
              console.log('开始播放')
            })
            // 更新播放时长
            setTimeout(() => {
              backgroundAudioManager.currentTime
              backgroundAudioManager.onTimeUpdate(() => {
                let curMin = Math.floor(backgroundAudioManager.currentTime / 60)
                let curSec = Math.floor(backgroundAudioManager.currentTime % 60)
                self.setData({
                  'currentTime': backgroundAudioManager.currentTime,
                  'curMin': curMin,
                  'curSec': curSec
                })
                // console.log('当前播放时长', self.data.currentTime)
              })
            }, 500)
            self.setData({
              'min': e.currentTarget.dataset.item.min,
              'sec': e.currentTarget.dataset.item.sec,
              'totalDuration': e.currentTarget.dataset.item.duration,
              'isPlaying': isPlaying,
              'audioPath': audioPath,
              'courseTitle': courseTitle
            })
            break
          } else {
            wx.pauseBackgroundAudio()
            console.log('暂停播放')
            self.setData({
              'isPlaying': false
            })
          }
          backgroundAudioManager.onEnded(() => {
            console.log('播放完毕')
            backgroundAudioManager.offEnded()
            // clearInterval(this.data.audiotimer)
            self.data.lists[i].isPlaying = false
            self.setData({
              'lists': self.data.lists,
              'isPlaying': false
            })
          })
          backgroundAudioManager.onError((res) => { // 音频播放失败
            console.log(res.errMsg)
            console.log(res.errCode)
          })
        } else {
          self.data.lists[i].isPlaying = false
          self.setData({
            'lists': self.data.lists
          })
        }
      }
    } else {
      this.setData({
        'isLockBoxHide': !this.data.isLockBoxHide,
        'singleCoursePrice': singleCoursePrice,
        'singleCourseId': singleCourseId
      })
    }
  },
  // 播放暂停按钮
  audioPlayClick() {
    let self = this
    if (self.data.audioPath != backgroundAudioManager.src) {
      backgroundAudioManager.src = self.data.audioPath
    }
    if (self.data.isPlaying) {
      backgroundAudioManager.pause()
      self.setData({
        'isPlaying': false
      })
    } else {
      backgroundAudioManager.play()
      setTimeout(() => {
        backgroundAudioManager.currentTime
        backgroundAudioManager.onTimeUpdate(() => {
          let curMin = Math.floor(backgroundAudioManager.currentTime / 60)
          let curSec = Math.floor(backgroundAudioManager.currentTime % 60)
          self.setData({
            'currentTime': backgroundAudioManager.currentTime,
            'curMin': curMin,
            'curSec': curSec
          })
          // console.log(self.data.curMin, self.data.curSec)
        })
      }, 500)
      self.setData({
        'isPlaying': true
      })
    }
  },
  // 上一首
  previousAudio() {
    let that = this
    let audioIndex = this.data.audioIdx
    let newAudioIndex = audioIndex - 1
    console.log('当前', audioIndex, newAudioIndex)

    if (audioIndex <= 0) {
      wx.showToast({
        title: '已经是第一首了...',
        icon: 'none',
        duration: 1000
      })
      return false
    } else {
      for (let i = newAudioIndex; i >= 0; i--) {
        let newAudio = that.data.lists[i]
        let courseTitle = that.data.lists[i].course_title
        let audioPath = that.data.lists[i].course
        console.log('当前播放音频', newAudio)
        that.setData({
          'min': newAudio.min,
          'sec': newAudio.sec,
          'audioPath': audioPath
        })
        if (that.data.lists[i].is_pay) {
          let dom = 'newAudio.isPlaying'
          that.setData({
            audioIdx: i
          })
          backgroundAudioManager.src = app.ossImgUrl + newAudio.course
          backgroundAudioManager.title = courseTitle
          backgroundAudioManager.play()
          setTimeout(() => {
            backgroundAudioManager.currentTime
            backgroundAudioManager.onTimeUpdate(() => {
              let curMin = Math.floor(backgroundAudioManager.currentTime / 60)
              let curSec = Math.floor(backgroundAudioManager.currentTime % 60)
              this.setData({
                'currentTime': backgroundAudioManager.currentTime,
                'curMin': curMin,
                'curSec': curSec,
              })
            })
          }, 500)
          this.setData({
            'isPlaying': true
          })
          console.log('新播放', newAudio)
          break
        }
      }
    }
  },
  // 下一首
  nextAudio() {
    let that = this
    let audioIndex = this.data.audioIdx
    let newAudioIndex = audioIndex + 1
    console.log('当前', audioIndex, newAudioIndex)

    if (newAudioIndex >= that.data.lists.length) {
      wx.showToast({
        title: '已经是最后一首了...',
        icon: 'none',
        duration: 1000
      })
      return false
    } else {
      for (let i = newAudioIndex; i < that.data.lists.length; i++) {
        let newAudio = that.data.lists[i]
        let courseTitle = that.data.lists[i].course_title
        let audioPath = that.data.lists[i].course
        that.setData({
          'min': newAudio.min,
          'sec': newAudio.sec,
          'audioPath': audioPath
        })
        if (that.data.lists[i].is_pay) {
          let dom = 'newAudio.isPlaying'
          that.setData({
            audioIdx: i
          })
          backgroundAudioManager.src = app.ossImgUrl + newAudio.course
          backgroundAudioManager.title = courseTitle
          backgroundAudioManager.play()
          setTimeout(() => {
            backgroundAudioManager.currentTime
            backgroundAudioManager.onTimeUpdate(() => {
              let curMin = Math.floor(backgroundAudioManager.currentTime / 60)
              let curSec = Math.floor(backgroundAudioManager.currentTime % 60)
              this.setData({
                'currentTime': backgroundAudioManager.currentTime,
                'curMin': curMin,
                'curSec': curSec
              })
            })
          }, 500)
          this.setData({
            'isPlaying': true
          })
          console.log('新播放', newAudio)
          break
        }
      }
    }
  },

  // 播放条拖拽
  slidingBar(e) {
    let self = this
    let updateTime = e.detail.value
    console.log('updateTime', updateTime)
    if (self.data.audioPath != backgroundAudioManager.src) {
      backgroundAudioManager.src = self.data.audioPath
    }
    if (self.data.isPlaying) {
      backgroundAudioManager.seek(updateTime)
      // self.setData({
      //   // 'isPlaying': false,
      //   'currentTime': updateTime
      // })
      // backgroundAudioManager.play()
    }

  },

  // 弹窗解锁课程
  toBuyCourse() {
    if (this.data.audioCourse.money != 0) {
      wx.navigateTo({
        url: '/pages/audioVideoCourse/buyCourse/buyCourse?courseId=' + this.data.singleCourseId + '&type=1' + '&distribute_id=' + this.data.identityId,
      })
    }
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
        showModalStatus2: false,
        comId: 0
      })
    }.bind(this), 200)
  },

  // 回复
  //显示对话框
  showReplyModal: function(e) {
    let comId = e.currentTarget.dataset.id
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      'animationData': animation.export(),
      'showModalStatus3': true,
      'comId': comId
    })
    console.log('comId', comId)
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideReplyModal: function() {
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
        'animationData': animation.export(),
        'showModalStatus3': false,
        'showModalStatus': false,
        'isFocus': false,
        'comId': 0
      })
    }.bind(this), 200)
  },
  // 取消按钮点击
  cancelBtnClick() {
    this.setData({
      'showModalStatus3': false,
      'comId': 0
    })
  },
  // 回复按钮点击
  replyBtnClick() {
    let self = this
    self.setData({
      'isFocus': true,
      'showModalStatus3': false
    })
  },
  // 二级评论
  secCommendClick(e) {
    let comId = e.currentTarget.dataset.id
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      'animationData': animation.export(),
      'showModalStatus3': true,
      'comId': comId
    })
    console.log('comId', comId)
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  // 二级评论展示
  showMoreComment(e) {
    let idx = e.currentTarget.dataset.idx
    let self = this,
      url = `${app.baseUrl}/interface/Course/audio_reply`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.courseId,
    }
    app.wxRequest(url, data, (res) => {
      if (res.data.err_code = 1) {
        var commentList = []
        commentList = res.data.data
        for (let i = 0; i < res.data.data.length; ++i) {
          if (idx == i) {
            res.data.data[i].isShow = !res.data.data[i].isShow
          }
        }
        self.setData({
          'commentList': commentList,
        })
        console.log('isShow', commentList)
      }
    })
  }
})