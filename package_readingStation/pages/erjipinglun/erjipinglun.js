const app = getApp()
Page({
  data: {
    content: '',
    isSub: false
  },

  onLoad(options) {
    console.log(options)
    this.setData({
      'com_id': options.com_id,
      'c_others': options.c_others
    })
  },
  getInputMsg(e) {
    if (e.detail.value) {
      this.setData({
        'content': e.detail.value,
      })
    }
  },
  submitInfo() {
    if (this.data.isSub) return
    this.setData({ 'isSub': true })
    if (!this.data.content) {
      wx.showModal({
        title: '提示',
        content: '请输入评论内容',
      })
    }
    let self = this, url = app.baseUrl + '/Api/second_develop/add_two_comment', data = {}
    data = {
      'openid': app.globalData.openId,
      'com_id': this.data.com_id,
      'c_others': this.data.c_others,
      'content': this.data.content
    }
    wx.showLoading()
    app.wxRequest(url, data, function (res) {
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