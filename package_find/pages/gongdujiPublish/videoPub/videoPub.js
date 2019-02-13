const app = getApp()
Page({
  data: {
    videoTitle: '', // 标题
    videoContent: '', // 内容
    videoTempath: '', // 视频
    isSub: false, // 是否正在提交
    isLock: 0,  // 是否上锁 0未上锁 1上锁
  },
  onLoad(options) {

  },
  onReady() {

  },
  onShow() {
    this.getUserInfo()
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
    this.setData({
      'videoContent': e.detail.value
    })
  },
  selectVideo() {
    let self = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      // camera: 'back',
      success: function(res) {
        console.log('1111111111111',res)
        self.setData({
          'videoTempath': res.tempFilePath
        })
      },
      fail: function(res) {
        wx.showToast({
          title: res,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 提交
  submitVideo() {
    let self = this
    if (self.data.isSub) return
    self.setData({
      'isSub': true
    })
    console.log('1111111',self.data)
    if (!self.data.videoTempath) {
      wx.showModal({
        title: '提示',
        content: '上传视频才能发布哦',
        showCancel: false
      })
      self.setData({
        'isSub': false
      })
      return
    }
    wx.showLoading({
      title: '正在努力提交中.',
    })
    wx.uploadFile({ // 上传文件
      url: app.globalData.urlApi.edit_video,
      filePath: self.data.videoTempath, // 临时路径
      name: 'file',
      success: function(res) {
        // console.log(res)
        let dataName = JSON.parse(JSON.stringify(self.trimKong(res.data))) // 解析返回json字符串
        console.log(dataName)
        let url = app.baseUrl + '/interface/Reading/pub_album',
          data = {}
        data = {
          'openid': app.globalData.openId,
          'type': '1',
          'content': self.data.videoContent,
          'video': dataName.data,
          'is_cable': self.data.isLock
        }
        app.wxRequest(url, data, function(res) {
          wx.hideLoading()
          console.log('提交结果', res)
          wx.showToast({
            title: '发布成功',
          })
          self.setData({
            'isSub': false
          })
          if (res.data.code == 1) {
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/discover/discover',
              })
            }, 1000)
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
  btn_delete() {
    this.setData({
      'videoTempath': ''
    })
  },
  // 获取用户信息
  getUserInfo() {
    let self = this, url = `${app.baseUrl}/interface/Reading/get_info`, data = {}
    data = {
      'openid': app.globalData.openId,
    }
    app.wxRequest(url, data, (res) => {
      console.log('用户信息',res)
      if(res.data.code == 1) {
        this.setData({
          'user': res.data.data
        })
      }
    })
  },
  // 设置私密按钮
  lockBtnClick() {
    if(this.data.isLock == 0) {
      var isLock = 1
    } else {
      var isLock = 0
    }
    this.setData({
      'isLock': isLock
    })
  }
})