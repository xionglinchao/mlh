const app = getApp()

Page({
  data: {
    isLiked: false, // 是否点赞
    isFocused: false, // 是否关注
    focus: false, // 点击二级评论内容获取光标
    other_id: '', // 被评论的id
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
      var articleId = sceneId
    } else {
      var articleId = options.articleId
    }
    this.setData({
      'articleId': articleId || null,
      'u_id': m_id || options.u_id || null
    })
    this.bindLowerLevel()
  },
  onReady: function() {

  },
  onShow: function() {
    this.getArticleInfo()
    let self =this
    setTimeout(function() {
      self.friendCircleCode()
    },300)
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
      let articleId = res.target.dataset.item.id
      return {
        title: '美丽花亲子时光',
        path: '/package_find/pages/gongdujiPublish/pubDetail/pubDetail?articleId=' + articleId + '&u_id=' + this.data.mine,
      }
    }
  },

  // 朋友圈二维码
  friendCircleCode() {
    let self = this,
      url = `${app.baseUrl}/interface/UserInfo/get_code_picture`,
      data = {}
    data = {
      'id': self.data.articleId,
      'type': 1,
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
      setTimeout(function(){
        self.shareFriendCircle()
      },2000)
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
    }
  },

  // 点赞
  likeClick: function(e) {
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
      self.getArticleInfo()
    })
  },
  // 关注
  focusedClick(e) {
    // console.log(e)
    let self = this,
      url = `${app.baseUrl}/interface/Personal_center/whether_attention`,
      data = {}
    let item = e.currentTarget.dataset.item,
      focus = 0
    if (item.is_focus == 0) {
      focus = 1
    } else {
      focus = 0
    }
    data = {
      'openid': app.globalData.openId,
      'id': item.id,
      'type': focus // 1关注 0取消关注
    }
    app.wxRequest(url, data, (res) => {
      console.log('关注按钮', res)
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
      // 更新页面数据
      self.getArticleInfo()
    })
  },
  // 获取页面详情
  getArticleInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Reading/article_detail`,
      data = {}
    data = {
      'id': this.data.articleId,
      'openid': app.globalData.openId,
      'per_page': this.data.curPage,
    }
    app.wxRequest(url, data, (res) => {
      console.log('文章详情', res)
      if (res.data.code == 1) {
        // res.data.data.content = JSON.parse(res.data.data.content)
        res.data.data.like_num = res.data.data.like_num
        if (this.data.curPage > 1) {
          var commentList = self.data.commentList
          var resArr = []
          commentList = commentList.concat(res.data.data.comment)
          for (let i = 0; i < res.data.data.comment.length; ++i) {
            resArr.push(res.data.data.comment[i])
          }
          console.log('111', resArr)
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
        self.setData({
          'articleDetail': res.data.data,
          'writer': res.data.data.writer,
          'content': res.data.data.content,
          'userId': res.data.data.u_id,
          'commentList': commentList,
          'mine': res.data.data.mine,
          'isLock': res.data.data.is_cable,  // 是否上锁 0 false 1 true
          'isMine': res.data.data.is_mine
        })
        console.log('111111', this.data.mine)
      }
    })
  },
  // 加载更多
  loadMore() {
    this.data.curPage++
      this.setData({
        'curPage': this.data.curPage
      })
    this.getArticleInfo(this.data.curPage)
  },
  // 获取评论内容
  bindValueInput(e) {
    this.setData({
      'commentCont': e.detail.value
    })
  },
  // 发送评论
  leaveMessage() {
    let self = this
    if (!self.data.commentCont) {
      wx.showToast({
        title: '请出入内容！',
        icon: 'none',
        duration: 1000
      })
    } else {
      let url = `${app.baseUrl}/interface/Reading/comment`,
        data = {}
      data = {
        'id': self.data.articleId,
        'openid': app.globalData.openId,
        'other': self.data.other_id,
        'content': self.data.commentCont
      }
      app.wxRequest(url, data, (res) => {
        console.log('评论结果', res)
        if(res.data.err_code == 1) {
          self.setData({
            commentCont: '',
            curPage: 1,
            toTop: 0,
          })
          // 更新页面数据
          self.getArticleInfo()
        }
      })
    }
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
  deleteBtnClick(e) {
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
      content: '确定删除？',
      success: function(res) {
        if (res.confirm) {
          app.wxRequest(url, data, function(res) {
            console.log('删除评论', res)
            if (res.data.code == 1) {
              self.setData({
                curPage: 1
              })
              self.getArticleInfo()
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
  // 主页跳转
  toHomePage() {
    wx.reLaunch({
      url: '/pages/homepage/homepage',
    })
  },
  // 头像跳转个人主页
  toPersonalPage(e) {
    console.log(e)
    let id = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + id,
    })
  },
  // 视频播放跳转
  toVideoPlay(e) {
    let videoPlay = e.currentTarget.dataset.item.video
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
      if(res.data.code == 1) {
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
  }
})