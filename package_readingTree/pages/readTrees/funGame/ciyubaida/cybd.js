const app = getApp()
const recorderManager = wx.getRecorderManager() // 录音发布管理
const innerAudioContext1 = wx.createInnerAudioContext() // 引导录音管理
const innerAudioContext2 = wx.createInnerAudioContext() // 卡牌声音管理
const innerAudioContext3 = wx.createInnerAudioContext() // 发布录音声音管理
const innerAudioContext4 = wx.createInnerAudioContext() // 评论声音管理
Page({
  data: {
    hh: true,
    guideAudio: { // 引导录音
      isPlaying: false, // 是否正在播放
      path: '', // 路径
      duration: 40 // 时长
    },
    bookList: [], // 相关书籍列表
    gameId: '10',
    gameCardList: [ // 游戏卡牌
      {
        idx: 0, // 索引
        data: null, // 内容
        flip: false // 翻转状态 false：未翻转
      },
      {
        idx: 1,
        data: null,
        flip: false
      },
      {
        idx: 2,
        data: null,
        flip: false
      }
    ],
    micopAni: false,
    commentList: [], // 评论列表
    isLoadingMore: false, // 是否正在加载更多数据
    curPage: 1, // 当前加载数据的页数
    allPages: 0, // 数据总的页数
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
    isSubTextHide: true
  },
  onLoad: function(options) {
    let scene = decodeURIComponent(options.scene)
    console.log('场景值', scene)
    if (scene != 'undefined') {
      let sceneId = scene.split('&')[0].split('=')[1]
      var m_id = scene.split('&')[1].split('=')[1]
    }
    this.setData({
      'u_id': m_id || options.u_id || null
    })
    this.getUserId()
    this.getGameBasicInfo()
    this.bindLowerLevel()
  },
  onReady: function() {

  },
  onShow: function() {
    let self = this
    setTimeout(function(){
      self.friendCircleCode()
    },100)
  },
  onHide: function() {

  },
  onUnload: function() {
    innerAudioContext1.stop()
    innerAudioContext2.stop()
    innerAudioContext3.stop()
    innerAudioContext4.stop()
  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function(res) {
    if(res.from == 'button') {
      return {
        title: '美丽花亲子时光',
        path: '/package_readingTree/pages/readTrees/funGame/ciyubaida/cybd?gameId=' + this.data.gameId + '&u_id=' + this.data.userId,
      }
    }
  },

  // 朋友圈二维码
  friendCircleCode() {
    let self = this,
      url = `${app.baseUrl}/interface/UserInfo/get_code_picture`,
      data = {}
    data = {
      'id': 0,
      'type': 2,
      'u_id': self.data.userId
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

  getUserId() {
    let self = this,
      url = app.baseUrl + '/Api/Change/into_uid',
      data = {}
    data = {
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, (res) => {
      console.log('获取userId', res)
      this.setData({
        'userId': res.data.data
      })
      this.getCommentList()
    })
  },
  // 加载更多
  loadMore() {
    if (this.data.isLoadingMore) return
    console.log(this.data.allPages)
    this.data.curPage++
      if (this.data.curPage <= this.data.allPages) {
        this.setData({
          'isLoadingMore': true,
          'curPage': this.data.curPage
        })
        this.getCommentList(this.data.curPage)
      } else {
        wx.showToast({
          icon: 'none',
          title: '没有更多内容啦',
          duration: 1000
        })
      }
  },
  // 获取页面基本信息
  getGameBasicInfo() {
    let self = this,
      url = app.baseUrl + '/Api/Games/detail',
      data = {}
    data = {
      'id': this.data.gameId,
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, function(res) {
      console.log('词语百搭', res)
      if (res.data.code == 1) {
        for (let i = 0; i < res.data.data.book_lists.length; ++i) {
          for (let j = 0; j < self.data.gameCardList.length; ++j) {
            if (i == j) {
              self.data.gameCardList[j].data = res.data.data.book_lists[j]
            }
          }
        }
        self.setData({
          'guideAudio.path': res.data.data.audio_path,
          'guideAudio.duration': res.data.data.audio_path_time,
          'gameCardList': self.data.gameCardList,
        })
      }
    })
  },
  // 获取评论列表
  getCommentList(page = null) {
    let self = this,
      url = app.baseUrl + '/interface/Comment/view_commments',
      data = {}
    data = {
      'com_id': this.data.gameId,
      'type': '4',
      'openid': app.globalData.openId,
      'p': page || this.data.curPage
    }
    console.log(113, data)
    wx.showLoading({
      title: '正在加载中',
    })
    app.wxRequest(url, data, function(res) {
      console.log('获取评论列表', res)
      if (res.data.code == 1) {
        if (page > 1) {
          var commentList = self.data.commentList
          for (let i = 0; i < res.data.data.length; ++i) {
            let cardList = []
            for (let j = 0; j < res.data.data[i].litpic.length; ++j) {
              // console.log(res.data.data[i].litpic[j])
              let card = {}
              let pic = res.data.data[i].litpic[j].slice(0, res.data.data[i].litpic[j].indexOf('\\')) // 卡牌图片列表
              let name = res.data.data[i].litpic[j].slice(res.data.data[i].litpic[j].indexOf('\\') + 1) // 卡牌名称列表
              card = {
                'pic': pic,
                'name': name
              }
              cardList.push(card)
            }
            // console.log(cardList)
            res.data.data[i].cardList = cardList
            res.data.data[i].video = app.ossImgUrl + res.data.data[i].video
            res.data.data[i].isPlaying = false
          }
          commentList = commentList.concat(res.data.data)
        } else {
          var commentList = []
          for (let i = 0; i < res.data.data.length; ++i) {
            let cardList = []
            for (let j = 0; j < res.data.data[i].litpic.length; ++j) {
              // console.log(res.data.data[i].litpic[j])
              let card = {}
              let pic = res.data.data[i].litpic[j].slice(0, res.data.data[i].litpic[j].indexOf('\\')) // 卡牌图片列表
              let name = res.data.data[i].litpic[j].slice(res.data.data[i].litpic[j].indexOf('\\') + 1) // 卡牌名称列表
              card = {
                'pic': pic,
                'name': name
              }
              cardList.push(card)
            }
            // console.log(cardList)
            res.data.data[i].cardList = cardList
            res.data.data[i].video = app.ossImgUrl + res.data.data[i].video
            res.data.data[i].isPlaying = false
          }
          commentList = res.data.data
        }
        console.log('commentList', commentList)
        self.setData({
          'commentList': commentList,
          'allPages': res.data.data[0].all_pages,
          'isLoadingMore': false,
        })
      }
      wx.hideLoading()
    })
  },
  // 关注按钮
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
  // 点赞按钮事件
  likeBtnClick(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.likedIdx
    let dom = `commentList[${index}].whether_like`
    let like = item.whether_like === 0 ? 1 : 0
    let url = app.globalData.urlApi.setChioceLikes,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': item.id, // 单个评论所在列表中的id
      'type': like // 1点赞 0取消点赞
    }
    app.wxRequest(url, data, (res) => [
      that.setData({
        [dom]: like
      }),
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
    ])
  },
  // 显示卡牌结果
  showGameContent(e) {
    let self = this,
      url = app.baseUrl + '/Api/Games/choose_card',
      data = {}
    let maskIdx = Number(e.currentTarget.dataset.maskIdx)
    switch (maskIdx) {
      case 0:
        data.type = 'A'
        break
      case 1:
        data.type = 'B'
        break
      case 2:
        data.type = 'C'
        break
      default:
        ;
    }
    data.openid = app.globalData.openId
    app.wxRequest(url, data, function(res) {
      console.log('卡牌信息', res)
      // 播放点击音效
      innerAudioContext2.autoplay = true
      innerAudioContext2.src = res.data.data.audio_path
      console.log('开始播放卡牌声音')
      innerAudioContext2.play()
      // 停止其他声音
      innerAudioContext1.stop()
      innerAudioContext3.stop()
      innerAudioContext4.stop()
      // 停止引导声音及录制录音动画
      clearInterval(self.data.audiotimer) // 录制录音播放动画定时器
      self.setData({
        'guideAudio.isPlaying': false,
        'isRecPlaying': false
      })
      // 停止评论声音动画
      for (let i = 0; i < self.data.commentList.length; ++i) {
        self.data.commentList[i].isPlaying = false
        self.setData({
          'commentList': self.data.commentList
        })
      }
      // innerAudioContext2.onPlay(() => {
      // })
      innerAudioContext2.onError((res) => { // 音频播放失败
        console.log(res.errMsg)
        console.log(res.errCode)
      })
      // 翻转对应的卡牌，添加翻转的状态
      for (let i = 0; i < self.data.gameCardList.length; ++i) {
        if (maskIdx == i) {
          self.data.gameCardList[i].data = res.data.data
          self.data.gameCardList[i].flip = true
        }
        if (i == 1) {
          self.setData({
            'micopAni': true
          })
        }
      }

      // for (let j = 0; j < self.data.gameCardList.length; ++j) {
      //   if (!self.data.gameCardList[j].flip) {
      //     console.log(1)
      //     self.setData({
      //       'hh': true
      //     })
      //     break
      //   }
      //   console.log(2)
      //   self.setData({
      //     'hh': false
      //   })
      // }
      self.setData({
        'gameCardList': self.data.gameCardList
      })
      // console.log(self.data.gameCardList)
    })
  },
  // 卡牌翻回
  backToCardMask(e) {
    let cardIdx = Number(e.currentTarget.dataset.cardIdx)
    for (let i = 0; i < this.data.gameCardList.length; ++i) {
      if (cardIdx == i) {
        this.data.gameCardList[i].flip = false
      }
      // if (!this.data.gameCardList[i].flip) {
      //   this.setData({
      //     'hh': true
      //   })
      // }
    }
    this.setData({
      'gameCardList': this.data.gameCardList
    })
  },
  // 播放引导录音
  playGuideAudio() {
    let self = this
    console.log('引导录音路径', self.data.guideAudio.path)
    if (self.data.guideAudio.isPlaying) return
    self.setData({
      'guideAudio.isPlaying': true
    })
    innerAudioContext1.autoplay = true
    innerAudioContext1.src = self.data.guideAudio.path
    console.log('开始播放引导录音')
    innerAudioContext1.play()
    // 停止其他声音
    innerAudioContext2.stop()
    innerAudioContext3.stop()
    innerAudioContext4.stop()
    // 停止录制录音及动画
    clearInterval(self.data.audiotimer)
    self.setData({
      'isRecPlaying': false
    })
    // 停止评论录音动画
    for (let i = 0; i < self.data.commentList.length; ++i) {
      self.data.commentList[i].isPlaying = false
      self.setData({
        'commentList': self.data.commentList
      })
    }
    // innerAudioContext1.onPlay(() => {
    // })
    // 引导录音自动播放完毕
    innerAudioContext1.onEnded(() => {
      innerAudioContext1.offEnded()
      console.log('引导录音播放完毕')
      clearInterval(self.data.audiotimer)
      self.setData({
        'guideAudio.isPlaying': false
      })
    })
    // 音频播放失败
    innerAudioContext1.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
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
        innerAudioContext2.stop()
        innerAudioContext3.stop()
        // 停止引导声音及录制录音动画
        clearInterval(self.data.audiotimer) // 录制录音播放动画定时器
        self.setData({
          'guideAudio.isPlaying': false,
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
  // 开始录音
  startRecord() {
    let self = this
    self.setData({
      'voiceSub.isHide': false
    })
    let options = { // 录音配置项
      'duration': 20000,
      'sampleRate': 16000,
      'numberOfChannels': 1,
      'encodeBitRate': 96000,
      'format': 'mp3',
      'frameSize': 50
    }
    let voiceDuration = 0
    // 录音动画
    let timer = setInterval(() => {
      self.data.voiceSub.idx++
        voiceDuration += 150
      if (voiceDuration >= options.duration) {
        voiceDuration = options.duration
        self.stopRecord()
      }
      self.setData({
        'voiceSub.duration': Math.round(voiceDuration / 1000),
        'voiceSub.idx': self.data.voiceSub.idx,
        'voiceSub.timer': timer
      })
      if (self.data.voiceSub.idx >= 3) self.data.voiceSub.idx = 1
    }, 150)
    // 录音逻辑
    recorderManager.start(options)
    recorderManager.onStart(() => {
      // 开始录音时，停止所有正在播放都声音
      innerAudioContext1.stop()
      innerAudioContext2.stop()
      innerAudioContext3.stop()
      innerAudioContext4.stop()
      // 停止引导录音动画
      self.setData({
        'guideAudio.isPlaying': false
      })
      // 停止评论声音动画
      for (let i = 0; i < self.data.commentList.length; ++i) {
        self.data.commentList[i].isPlaying = false
        self.setData({
          'commentList': self.data.commentList
        })
      }
      console.log('开始录音')
    })
    recorderManager.onError((res) => {
      console.log('录音失败', res)
    })
  },
  // 停止录音
  stopRecord() {
    // this.setData({ 'voiceSub.isHide': true })
    clearInterval(this.data.voiceSub.timer)
    this.setData({
      'voiceSub.timer': null
    })
    recorderManager.stop()
    recorderManager.onStop((res) => {
      console.log('结束录音', res)
      this.setData({
        'audioTempath': res.tempFilePath,
        'audioDuration': res.duration,
        'isRecording': false
      })
    })
  },
  // 重录
  restartRecord() {
    this.setData({
      'voiceSub.duration': 0,
      'isRecording': true,
      'isRecPlaying': false
    })
    innerAudioContext3.stop()
    clearInterval(this.data.audiotimer)
  },
  // 播放/暂停录音
  playRecord() {
    let self = this
    console.log(this.data.audioTempath)
    if (!self.data.isRecPlaying) {
      self.setData({
        'isRecPlaying': true
      })
      // 播放动画
      self.data.audiotimer = setInterval(() => {
        // console.log(2)
        self.data.voiceSub.idx++
          self.setData({
            'audiotimer': self.data.audiotimer,
            'voiceSub.idx': self.data.voiceSub.idx
          })
        if (self.data.voiceSub.idx >= 3) self.data.voiceSub.idx = 1
      }, 150)
      // 播放声音
      innerAudioContext3.autoplay = true
      innerAudioContext3.src = self.data.audioTempath
      console.log('播放录制录音')
      innerAudioContext3.play()
      // 停止其他声音
      innerAudioContext1.stop()
      innerAudioContext2.stop()
      innerAudioContext4.stop()
      self.setData({
        'guideAudio.isPlaying': false
      })
      for (let i = 0; i < self.data.commentList.length; ++i) {
        self.data.commentList[i].isPlaying = false
        self.setData({
          'commentList': self.data.commentList
        })
      }
      innerAudioContext3.onEnded(() => {
        console.log('自然播放完毕')
        innerAudioContext3.offEnded()
        clearInterval(self.data.audiotimer)
        self.setData({
          'isRecPlaying': false
        })
      })
      innerAudioContext3.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
    } else { // 暂停
      clearInterval(self.data.audiotimer)
      self.setData({
        'isRecPlaying': false
      })
      innerAudioContext3.pause()
    }
  },
  // 发布录音
  publishRecord() {
    if (this.data.isPublishing) return
    this.setData({
      'isPublishing': true
    })
    console.log(this.data.audioTempath)
    let self = this,
      url = app.baseUrl + '/interface/Comment/add_commments',
      data = {},
      litpic = []
    for (let i = 0; i < this.data.gameCardList.length; ++i) {
      if (this.data.gameCardList[i].flip) {
        litpic.push((this.data.gameCardList[i].data.pic + '\\' + this.data.gameCardList[i].data.card_name))
      } else {
        wx.showModal({
          title: '提示',
          content: '你的卡片还没有翻完哦，不能发布',
        })
        return
      }
    }
    wx.showLoading({
      title: '正在发布',
    })
    wx.uploadFile({ // 上传录音文件
      url: app.globalData.urlApi.edit_audio,
      filePath: this.data.audioTempath, // 临时路径
      name: 'file',
      success: function(res) {
        // console.log(res)
        var dataName = JSON.parse(JSON.stringify(self.trimKong(res.data))) // 解析返回json字符串
        console.log(dataName)
        data = {
          'openid': app.globalData.openId,
          'litpic': JSON.stringify(litpic),
          'type': '4',
          'com_id': self.data.gameId,
          'content': '',
          'fraction': '',
          'others': '',
          'video': dataName.data, // 文件路径
          'audio_duration': self.data.audioDuration
        }
        app.wxRequest(url, data, function(res) {
          console.log('发布结果', res)
          wx.hideLoading()
          self.setData({
            'isPublishing': false
          })
          if (res.data.code == 1) {
            wx.showModal({
              title: '提示',
              content: '发布成功',
              showCancel: false,
              success() {
                self.getCommentList()
                self.setData({
                  'voiceSub': {
                    'duration': '0',
                    'isHide': true, // 是否隐藏
                    'idx': 1, // 帧
                    'timer': null // 定时器
                  },
                  'isRecording': true
                })
              }
            })
          }
        })
      }
    })
  },
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
  // 跳转用户信息页面
  btn_person_information: function(e) {
    var self = this;
    var item = e.currentTarget.dataset.item;
    var parameterStrng = '?id=' + item.u_id;
    app.navigateWx(self, '/pages/personalHomepage/personalHomepage', parameterStrng);
  },
  // 私信
  btn_leave_comments: function(e) {
    var item = e.currentTarget.dataset.item
    var parameterStrng = '?id=' + item.u_id
    app.navigateWx(this, '/pages/leaveComments/leaveComments', parameterStrng)
  },
  // 跳转书籍详情
  toBookDeatail(e) {
    console.log(e)
    let id = e.currentTarget.dataset.item.shop_id
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + id,
    })
  },
  // 删除评论事件
  delClick(e) {
    let self = this,
      url = app.baseUrl + '/interface/Comment/del',
      data = {}
    let item = e.currentTarget.dataset.item
    console.log(item)
    data = {
      'openid': app.globalData.openId,
      'id': item.id
    }
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success: function(res) {
        if (res.confirm) {
          app.wxRequest(url, data, function(res) {
            console.log('删除评论', res)
            if (res.data.code == 1) {
              self.getCommentList()
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 1000
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      }
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
})