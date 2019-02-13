const app = getApp()
Page({
  data: {
    videoTitle: '', // 标题
    videoContent: '', // 内容
    videoTempath: '', // 视频
    isSub: false, // 是否正在体积哦
  },
  onLoad(options) {
    console.log(options)
    this.setData({
      'com_id': options.com_id
    })
  },
  onReady() {

  },
  onShow() {

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
    let id = Number(e.currentTarget.id)
    switch (id) {
      case 1:
        this.setData({ 'videoTitle': e.detail.value })
        break
      case 2:
        this.setData({ 'videoContent': e.detail.value })
        break
      default: ;
    }
  },
  selectVideo() {
    let self = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      // camera: 'back',
      success: function (res) {
        console.log(res)
        self.setData({
          'videoTempath': res.tempFilePath
        })
      }
    })
  },
  // 提交
  submitVideo() {
    let self = this
    if (self.data.isSub) return
    self.setData({ 'isSub': true })
    console.log(self.data)
    if (!self.data.videoTempath) {
      wx.showModal({
        title: '提示',
        content: '上传视频才能发布哦',
        showCancel: false
      })
      self.setData({ 'isSub': false })
      return
    }
    wx.showLoading({
      title: '正在努力提交中.',
    })
    wx.uploadFile({ // 上传文件
      url: app.globalData.urlApi.edit_video,
      filePath: self.data.videoTempath, // 临时路径
      name: 'file',
      success: function (res) {
        // console.log(res)
        let dataName = JSON.parse(JSON.stringify(self.trimKong(res.data))) // 解析返回json字符串
        console.log(dataName)
        let url = app.baseUrl + '/interface/find/add_comments', data = {}
        data = {
          'openid': app.globalData.openId,
          'type': '4',
          'com_id': self.data.com_id,
          'title': self.data.videoTitle,
          'content': self.data.videoContent,
          'video_path': dataName.data,
        }
        app.wxRequest(url, data, function (res) {
          wx.hideLoading()
          console.log('提交结果', res)
          wx.showToast({
            title: res.data.msg,
          })
          self.setData({ 'isSub': false })
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
  btn_delete() {
    this.setData({
      'videoTempath': ''
    })
  }
})