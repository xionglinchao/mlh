const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    audioTitle: '',
    audioContent: '',
    audioTempath: '',
    audioDuration: 0,
    soundMinute: 0,
    soundSecond: 0,
    recordScope: false,
    isSoundStart: false, // 是否开始录音
    isPlaying: false, // 是否在播放录音
    isSub: false, // 是否正在提交信息
    options: {
      duration: 600000, // 指定录音的时长，单位 ms
      sampleRate: 44100, // 采样率
      numberOfChannels: 1, // 录音通道数
      encodeBitRate: 192000, // 编码码率
      format: 'mp3', // 音频格式，有效值 aac/mp3
      frameSize: 50, // 指定帧大小，单位 KB
    },
    showCbtn: false,
  },
  onLoad(options) {
    console.log(options)
    this.setData({
      'com_id': options.com_id
    })
    this.soundMethod()
  },
  onReady() {

  },
  onShow() {
    this.recordAuth()
  },
  onHide() {

  },
  onUnload() {

  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },
  onShareAppMessage() {

  },
  getInputMsg(e) {
    if (e.currentTarget.id == 1) {
      this.setData({
        'audioTitle': e.detail.value,
      })
    } else if (e.currentTarget.id == 2) {
      this.setData({
        'audioContent': e.detail.value,
      })
    }
  },
  recordAuth() {
    let self = this
    if (this.data.recordScope) return
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
  // startRecord() {
  //   if (!app.globalData.canUse.getRecorderManager) {
  //     wx.showModal({
  //       title: '提示',
  //       content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
  //     })
  //   }
  //   // 开始录音
  //   recorderManager.start(this.data.options)
  //   recorderManager.onStart(() => {
  //     console.log('开始录音')
  //   })
  //   // 错误回调
  //   recorderManager.onError((res) => {
  //     console.log(res)
  //   })
  // },
  // // 停止录音
  // stopRecord() {
  //   recorderManager.stop()
  //   recorderManager.onStop((res) => {
  //     console.log('停止录音', res)
  //     let audioDuration = Math.round(res.duration / 1000)
  //     this.setData({
  //       'audioDuration': audioDuration,
  //       'audioTempath': res.tempFilePath,
  //     })
  //   })
  // },
  // 播放录音
  playRecord() {
    // if (!this.data.isPlaying) {
    //   innerAudioContext.autoplay = true
    //   innerAudioContext.src = this.data.audioTempath
    //   innerAudioContext.play()
    //   console.log('播放发布录音')
    //   innerAudioContext.onEnded(() => {
    //     console.log('自然播放完毕')
    //     clearInterval(this.data.audiotimer)
    //     this.setData({ 'isPlaying': false })
    //   })
    //   innerAudioContext.onError((res) => {
    //     console.log(res.errMsg)
    //     console.log(res.errCode)
    //   })
    // } else {
    //   this.setData({ 'isPlaying': false })
    //   innerAudioContext.stop()
    // }
    this.setData({ 'showCbtn': true })
    console.log(this.data.audioTempath)
    if (this.data.isPlaying) return
    this.setData({ 'isPlaying': true })
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.audioTempath
    innerAudioContext.play()
    // innerAudioContext.onPlay(() => {
    console.log('开始播放录音')
    // })
    innerAudioContext.onEnded(() => {
      innerAudioContext.offEnded()
      console.log('录音播放完毕')
      clearInterval(this.data.audiotimer)
      this.setData({ 'isPlaying': false })
    })
    innerAudioContext.onError((res) => { // 音频播放失败
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  soundMethod: function () {
    let self = this
    recorderManager.onStart(() => {
      console.log('录音开始')
      self.soundTimeCount()
    })
    recorderManager.onResume(() => {
      console.log('recorder resume')
    })
    recorderManager.onPause(() => {
      console.log('recorder pause')
    })
    recorderManager.onStop((res) => {
      console.log('停止录音', res)
      recorderManager.stop()
      let audioDuration = Math.round(res.duration / 1000)
      self.setData({
        'isSoundStart': false,
        'audioDuration': audioDuration,
        'audioTempath': res.tempFilePath,
      })

    })
    recorderManager.onFrameRecorded((res) => {
      console.log(res)
    })
  },
  trimKong: function (s) {//
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
  btn_record_click: function () {
    let self = this, soundMinute = this.data.soundMinute, soundSecond = this.data.soundSecond, isSoundStart = this.data.isSoundStart
    if (!app.globalData.canUse.getRecorderManager) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
      })
    }
    if (isSoundStart) {
      recorderManager.stop()
      isSoundStart = false
    } else {
      if (soundMinute == 0 && soundSecond == 0) {
        recorderManager.start(this.data.options)
      } else {
        recorderManager.resume()
      }
      isSoundStart = true
    }
    self.setData({
      isSoundStart: isSoundStart
    })
  },
  btn_cancel_recording: function () {
    var that = this, isRecording = that.data.isRecording, soundMinute = that.data.soundMinute, soundSecond = that.data.soundSecond
    if (!isRecording & soundSecond == 0 && soundMinute == 0) {
      wx.showToast({
        title: '还没有录音噢～',
        icon: 'none',
        duration: 2000
      })
    } else {
      innerAudioContext.stop()
      recorderManager.stop()
      that.setData({
        'isSoundStart': false,
        'isPlaying': false,
        'soundMinute': 0,
        'soundSecond': 0,
        'audioTempath': '',
        'audioDuration': 0,
        'showCbtn': false
      })
    }
  },
  btn_confirm_recording: function () {
    let self = this
    if (self.data.isSub) return
    self.setData({ 'isSub': true })
    console.log(this.data)
    if (!self.data.audioTempath) {
      wx.showModal({
        title: '提示',
        content: '需要先录制音频才能发布哦',
        showCancel: false
      })
      self.setData({ 'isSub': false })
      return
    }
    wx.uploadFile({ // 上传录音文件
      url: app.globalData.urlApi.edit_audio,
      filePath: self.data.audioTempath, // 临时路径
      name: 'file',
      success: function (res) {
        // console.log(res)
        let dataName = JSON.parse(JSON.stringify(self.trimKong(res.data))) // 解析返回json字符串
        console.log(dataName)
        let url = app.baseUrl + '/interface/find/add_comments', data = {}
        data = {
          'openid': app.globalData.openId,
          'type': '3',
          'com_id': self.data.com_id,
          'title': self.data.audioTitle,
          'content': self.data.audioContent,
          'audio_path': dataName.data,
          'audio_duration': self.data.audioDuration
        }
        wx.showLoading({
          title: '正在努力提交中.',
        })
        app.wxRequest(url, data, function (res) {
          console.log('提交结果', res)
          wx.hideLoading()
          self.setData({ 'isSub': false })
          wx.showToast({
            title: res.data.msg,
          })
          if (res.data.code == 1) {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          }
        })
      }
    })
  },
  soundTimeCount: function () {
    var that = this;
    var soundMinute = that.data.soundMinute;
    var soundSecond = that.data.soundSecond;
    var isSoundStart = that.data.isSoundStart;
    if (isSoundStart) {
      soundSecond++;
      if (soundSecond == 60) {
        soundSecond = 0;
        soundMinute++;
      }
      that.setData({
        soundSecond: soundSecond,
        soundMinute: soundMinute
      })
      if (soundMinute < 10) {

        var getTimeInt = setTimeout(function () {
          that.soundTimeCount()
        }, 1000)

        that.setData({
          getTimeInt: getTimeInt
        })
      }
    }
  },
  delRecord() {
    innerAudioContext.stop()
    recorderManager.stop()
    this.setData({
      'isSoundStart': false,
      'isPlaying': false,
      'soundMinute': 0,
      'soundSecond': 0,
      'audioTempath': '',
      'audioDuration': 0,
      'showCbtn': false
    })
  },
})