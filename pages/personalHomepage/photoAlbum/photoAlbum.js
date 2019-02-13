const app = getApp()

Page({
  data: {
    isListSwitch: false, // 是否隐藏相册列表1
    isListSwitch2: true, // 是否隐藏相册列表2

  },
  onLoad: function(options) {
    this.setData({
      'userId': options.userId || null
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getAlbumInfo()
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function(ops) {
    if (ops.from == 'button') {
      return {
        title: '美丽花亲子时光',
        path: '/pages/personalHomepage/photoAlbumDetail/photoAlbumDetail'
      }
    }
  },
  // 跳转首页
  toHomePage() {
    wx.reLaunch({
      url: '/pages/homepage/homepage',
    })
  },
  // 相册列表切换事件
  listSwitchClick() {
    this.setData({
      'isListSwitch': !this.data.isListSwitch,
      'isListSwitch2': !this.data.isListSwitch2
    })
  },
  // 删除相册详情
  deleteBtnClick: function(e) {
    let id = e.currentTarget.dataset.item.id
    let self = this,
      url = `${app.baseUrl}/interface/Reading/del_publish`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': id
    }
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      success: function(res) {
        if (res.confirm) {
          app.wxRequest(url, data, (res) => {
            console.log('删除', res)
            if (res.data.code == 1) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1000
              })
              // 更新页面数据
              self.getAlbumInfo()
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
  // 获取相册列表
  getAlbumInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Home_page/album`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': self.data.userId
    }
    app.wxRequest(url, data, (res) => {
      console.log('相册', res)
      if (res.data.code == 1) {
        for (let i = 0; i < res.data.data.album.length; ++i) {
          res.data.data.album[i].cover = app.ossImgUrl + res.data.data.album[i].cover
          if (res.data.data.album[i].type == 0) {
            var album = res.data.data.album[i].litpics
            res.data.data.album[i].albumArr = album.split(",")
            // console.log('res.data.data.album', res.data.data.album)
          }
        }
        self.setData({
          'writer': res.data.data.writer,
          'photoList': res.data.data.album
        })
      }
    })
  },
  // 相册详情跳转
  toAlbumDetailPage(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.item.id // 相册 视频 文章 id
    wx.navigateTo({
      url: '/pages/personalHomepage/photoAlbumDetail/photoAlbumDetail?id=' + id,
    })
  },
  // 图片预览
  img_preview(e) {
    // console.log(e)
    let itemUrl = e.currentTarget.dataset.src,
      itemArr = e.currentTarget.dataset.itemArr
    for (let i = 0; i < itemArr.length; ++i) {
      itemArr[i] = app.ossImgUrl + itemArr[i]
    }
    wx.previewImage({
      current: app.ossImgUrl + itemUrl,
      urls: itemArr,
    })
  },
  // 点赞
  likeBtnClick(e) {
    // 相册 视频 文章 id
    let id = e.currentTarget.dataset.item.id,
      like = 0
    let self = this,
      url = `${app.baseUrl}/interface/Reading/like_reading`,
      data = {}
    if (e.currentTarget.dataset.item.is_like == 0) {
      like = 1
    } else {
      like = 0
    }
    data = {
      'openid': app.globalData.openId,
      'id': id,
      'type': like // 是否点赞
    }
    app.wxRequest(url, data, (res) => {
      console.log('点赞', res.data.msg)
      // 跟新页面数据
      self.getAlbumInfo()
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000,
      })
    })
  }
})