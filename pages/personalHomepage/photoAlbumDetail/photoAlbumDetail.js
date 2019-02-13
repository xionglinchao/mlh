const app = getApp()

Page({
  data: {
    isLiked: false, // 是否点赞
    focus: false, // 点击二级评论内容获取光标
    other_id: '', // 被评论的id
    commentList: [], // 评论列表
    curPage: 1, // 当前加载数据的页数
    callbackcount: 10, //需要返回数据的个数
  },
  onLoad: function (options) {
    this.setData({
      articleId: options.id || null
    })
  },
  onReady: function () {
  
  },
  onShow: function () {
    this.getAlbumDetailInfo()
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
    
  },
  // 获取相册页面详情
  getAlbumDetailInfo(page = null) {
    let self = this, url = `${app.baseUrl}/interface/Reading/article_detail`, data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.articleId,
      'per_page': page || this.data.curPage,
    }
    app.wxRequest(url, data, (res) => {
      console.log('相册详情',res)
      if(res.data.code == 1) {
        if(res.data.data.type == 2) {
          res.data.data.content = JSON.parse(res.data.data.content)
        }
        if (this.data.curPage > 1) {
          var commentList = self.data.commentList
          var resArr = []
          commentList = commentList.concat(res.data.data.comment)
          for (let i = 0; i < res.data.data.comment.length; ++i) {
            resArr.push(res.data.data.comment[i])
          }
          if (resArr.length == 0) {
            wx.showToast({
              icon: 'none',
              title: '没有更多内容啦',
              duration: 1000
            })
          }
        } else {
          var commentList = []
          commentList = res.data.data.comment
        }
        this.setData({
          'albumDetail': res.data.data,
          'writer': res.data.data.writer,
          'litpics': res.data.data.litpics,
          'commentList': commentList,
          'isLock': res.data.data.is_cable,
          'isMine': res.data.data.is_mine
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
    this.getAlbumDetailInfo(this.data.curPage)
  },
  // 获取评论内容
  getInputValue(e) {
    let commentCont = e.detail.value
    this.setData({
      'commentCont': commentCont
    })
  },
  // 一级评论内容
  bindValueInput(e) {
    let self = this,
      url = `${app.baseUrl}/interface/Reading/comment`,
      data = {}
    data = {
      'id': this.data.articleId,
      'openid': app.globalData.openId,
      'other': this.data.other_id,
      'content': this.data.commentCont
    }
    app.wxRequest(url, data, (res) => {
      console.log('评论结果', res)
      // 更新页面数据
      self.setData({
        curPage: 1,
        toTop: 0
      })
      self.getAlbumDetailInfo()
    })
  },
  firstComment(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      'focus': true,
      'other_id': id
    })
  },
  // 二级评论
  secondComment(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id
    this.setData({
      'focus': true,
      'other_id': id
    })
  },
  thirdComment(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    this.setData({
      'focus': true,
      'other_id': id
    })
  },
  // 删除评论按钮
  deleteCommentBtnClick(e) {
    console.log(e)
    let idx = e.currentTarget.dataset.idx,
      item = e.currentTarget.dataset.item
    let self = this,
      url = `${app.baseUrl}/interface/Reading/del_comment`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': item.id // 评论id
    }
    wx.showModal({
      title: '提示',
      content: '是否确定删除？',
      success: function (res) {
        if (res.confirm) {
          app.wxRequest(url, data, function (res) {
            console.log('删除评论', res)
            if (res.data.code == 1) {
              self.setData({
                curPage: 1
              })
              self.getAlbumDetailInfo()
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
  // 点赞
  likeClick: function (e) {
    // console.log(e)
    let self = this,
      url = `${app.baseUrl}/interface/Reading/like_reading`,
      data = {}
    let item = e.currentTarget.dataset.item,
      like = 0
    if (item.whether_like == 1) {
      like = 0
    } else {
      like = 1
    }
    data = {
      'openid': app.globalData.openId,
      'id': item.id, // 单个评论所在列表中的id
      'type': like // 1点赞 0取消点赞
    }
    app.wxRequest(url, data, (res) => {
      console.log('点赞按钮', res.data.msg)
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
      // 更新页面数据
      self.setData({
        curPage: 1,
      })
      self.getAlbumDetailInfo()
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
  // 单张图片预览
  img_preview2(e) {
    let itemUrl = e.currentTarget.dataset.src,
      itemArr = []
    itemArr.push(itemUrl)
    for (let i = 0; i < itemArr.length; ++i) {
      itemArr[i] = app.ossImgUrl + itemArr[i]
    }
    wx.previewImage({
      current: app.ossImgUrl + itemUrl,
      urls: itemArr,
    })
  },
  // 视频播放跳转
  toVideoPlay(e) {
    let videoPlay = e.currentTarget.dataset.item.video
    wx.navigateTo({
      url: '/pages/videoPlay/videoPlay?videoPlay=' + videoPlay,
    })
  },
  // 删除相册详情
  deleteBtnClick: function () {
    let self = this,
      url = `${app.baseUrl}/interface/Reading/del_publish`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.articleId
    }
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      success: function (res) {
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
              wx.navigateBack({
                delta: 1
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

  // 设置私密按钮
  lockBtnClick() {
    if (this.data.isLock == 0) {
      var isLock = 1
    } else {
      var isLock = 0
    }
    this.setData({
      'isLock': isLock
    })
    let self = this, url = `${app.baseUrl}/interface/Reading/is_cable`, data = {}
    data = {
      'openid': app.globalData.openId,
      'id': self.data.articleId,
      'type': self.data.isLock
    }
    app.wxRequest(url, data, (res) => {
      console.log('上锁状态', res)
      if (res.data.code == 1) {
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
  }
})