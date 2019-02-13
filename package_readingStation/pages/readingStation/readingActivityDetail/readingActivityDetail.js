const app = getApp()
Page({
  data: {
    activityId: -1, // 读书会id
    isStared: false, // 是否收藏
    isPinglunAni: false, // 评论动画
    canPinglun: false, // 是否可以评论
    activityDetail: null, // 读书活动详情
    userCommentsList: [], // 用户评论列表
    donation: { // 捐赠活动详情
      isHide: true, // 是否隐藏
      data: {} // 数据
    },
    relatedBook: { // 相关书籍详情
      isHide: true, // 是否隐藏
      data: {} // 数据
    },
    personNamePro: [
      ['家长'],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      ['孩子'],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    ],
    personNameKey: [0, 0, 0, 0],
    vision: app.globalData.vision
  },
  onLoad: function (options) {
    this.setData({
      options: options
    })
    var that = this
    if (app.globalData.openId && app.globalData.openId != '') {
      console.log('openId111111', app.globalData.openId)
      let scene = decodeURIComponent(options.scene)
      console.log('场景值', scene, options)
      if (scene != 'undefined') {
        let sceneId = scene.split('&')[0].split('=')[1]
        var m_id = scene.split('&')[1].split('=')[1]
        var bookId = scene.split('&')[2].split('=')[1]
        var activityId = sceneId
      } else {
        var activityId = options.activityId
        var bookId = options.bookId
      }
      console.log('openId111111_BookId', bookId)
      this.setData({
        'bookId': bookId,
        'activityId': activityId || null,
        'u_id': m_id || options.u_id || null
      })
      this.bindLowerLevel()
    } else {
      console.log('openId444444444444444', app.globalData.openId)
      app.openIdReadyCallback = openId => {
        if (openId && openId != '') {
          console.log('执行了app回调')
          options = that.data.options
          let scene = decodeURIComponent(options.scene)
          console.log('场景值', scene, options)
          if (scene != 'undefined') {
            let sceneId = scene.split('&')[0].split('=')[1]
            var m_id = scene.split('&')[1].split('=')[1]
            var bookId = scene.split('&')[2].split('=')[1]
            var activityId = sceneId
          } else {
            var activityId = options.activityId
            var bookId = options.bookId
          }
          console.log('activityId444444444444444', activityId, bookId)
          this.setData({
            'bookId': bookId,
            'activityId': activityId || null,
            'u_id': m_id || options.u_id || null
          })
          this.bindLowerLevel()
        }
      }
    }
  },
  onReady: function() {

  },
  onShow: function() {
    this.get_is_login(this)
    this.getStarState(this.data.activityId)
    console.log('执行onshow')
    this.getPageDetail()
    this.getDonationDetail()
    this.getRelatedBookDetail()
    let self = this
    setTimeout(function(){
      self.friendCircleCode()
    },500)
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
    console.log(this.data.bookId, 'this.data.bookId')
    return {
      title: '美丽花亲子时光',
      path: '/package_readingStation/pages/readingStation/readingActivityDetail/readingActivityDetail?activityId=' + this.data.activityId + '&u_id=' + this.data.userId + '&bookId=' + this.data.bookId,
      success: (res) => {
        console.log("转发成功", res, 'activityId=' + this.data.activityId + '&u_id=' + this.data.userId + '&bookId=' + this.data.bookId);
      }
    }
  },

  // 朋友圈二维码
  friendCircleCode() {
    let self = this,
      url = `${app.baseUrl}/interface/UserInfo/get_code_picture`,
      data = {}
    data = {
      'id': this.data.activityId,
      'type': 3,
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
      let self = this, url = `${app.baseUrl}/interface/UserInfo/user_bind_bdistribution`, data = {}
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
    } else {
      console.log('11111111111')
    }
  },

  showDonationPopup() {
    this.setData({
      'donation.isHide': !this.data.donation.isHide
    })
  },
  showRelatedBookPopup() {
    this.setData({
      'relatedBook.isHide': !this.data.relatedBook.isHide
    })
  },
  // 获取页面详情
  getPageDetail() {
    var that = this
    setTimeout(() => {
      if (app.globalData.openId) {
        clearInterval(this.a)
        let self = this,
          url = app.baseUrl + '/Api/Second_develop/active_details',
          data = {}
        data = {
          'ac_id': this.data.activityId,
          'open_id': app.globalData.openId
        }
        console.log(that.data.activityId, this.data.activityId, 'activityIdactivityIdactivityId')
        app.wxRequest(url, data, function (res) {
          console.log('获取页面详情', res)
          if (res.data.code == 1) {
            self.setData({
              'activityDetail': res.data.data.active_data,
              'userCommentsList': res.data.data.comment_data,
              'userId': res.data.data.mine,
            })
          } else {
            that.getPageDetail()
            // wx.showToast({
            //   icon: 'none',
            //   title: '服务器出错',
            // })
          }
        })
      }
    }, 1000)
  },
  // 收藏按钮
  starBtnClick(e) {
    let self = this,
      url = app.globalData.urlApi.addFavorites,
      data = {}
    let id = e.currentTarget.dataset.id
    data = {
      'openid': app.globalData.openId,
      'type': 1,
      'id': id
    }
    app.wxRequest(url, data, function(res) {
      console.log(res)
      if (res.data.code == 1) {
        self.setData({
          'isStared': true
        })
      }
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
    })
  },
  // 获取收藏状态
  getStarState(id) {
    let self = this,
      url = app.globalData.urlApi.getPersonCollection,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'type': 1,
      'clt_id': id
    }
    app.wxRequest(url, data, function(res) {
      console.log('收藏状态', res)
      if (res.data.msg == '已收藏') {
        self.setData({
          'isStared': true
        })
      } else {
        self.setData({
          'isStared': false
        })
      }
    })
  },
  // 视频播放
  videoPlay(e) {
    console.log(e)
    var self = this
    var videoName = e.currentTarget.dataset.video
    var parameterStrng = '?videoPlay=' + videoName
    app.navigateWx(self, '/pages/videoPlay/videoPlay', parameterStrng)
  },
  // 捐赠详情
  getDonationDetail() {
    let self = this,
      url = app.baseUrl + '/Api/second_develop/welfare_donation_details',
      data = {}
    data = {
      // 'ac_id': 64
      'ac_id': this.data.activityId
    }
    app.wxRequest(url, data, function(res) {
      console.log('获取捐赠详情', res)
      if (res.data.code == 1) {
        self.setData({
          'donation.data': res.data.data
        })
      }
    })
  },
  // 我要捐赠
  btn_donation: function() {
    if (this.data.isLogin == 1) {
      if (this.data.donation.data.status == 1) {
        var parameterStrng = '?id=' + this.data.donation.data.id + '&judgment=' + this.data.donation.data.status
        app.navigateWx(this, '/package_readingStation/pages/donation/donation', parameterStrng);
      } else {
        wx.showModal({
          title: '提示',
          content: '捐赠活动已结束',
          showCancel: false
        })
      }
    } else {
      app.navigateWx(this, '/pages/forceLogin/forceLogin');
    }
  },
  // 相关书籍
  getRelatedBookDetail() {
    let self = this,
      url = app.baseUrl + '/Api/second_develop/active_relation_book',
      data = {}
    data = {
      // 'ac_id': 180
      'ac_id': this.data.activityId
    }
    app.wxRequest(url, data, function(res) {
      console.log('获取相关书籍', res)
      if (res.data.code == 1) {
        self.setData({
          'relatedBook.data': res.data.data
        })
      }
    })
  },
  btn_person_information(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    var parameterStrng = '?id=' + item.u_id
    app.navigateWx(self, '/pages/personalHomepage/personalHomepage', parameterStrng)
  },
  btn_person_information2(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    var parameterStrng = '?id=' + item.u_id
    app.navigateWx(self, '/pages/personalHomepage/personalHomepage', parameterStrng)
  },
  // 关注按钮
  subscribeBtnClick(e) {
    let self = this,
      url = app.baseUrl + '/interface/Personal_center/whether_attention',
      data = {}
    let sucIdx = e.currentTarget.dataset.sucIdx,
      item = e.currentTarget.dataset.item,
      focus = 0
    if (item.focus_type == 1) {
      focus = 0
    } else {
      focus = 1
    }
    for (let i = 0; i < this.data.userCommentsList.length; ++i) {
      if (sucIdx == i) {
        data = {
          'openid': app.globalData.openId,
          'id': item.u_id,
          'type': focus // 1关注 0取消关注
        }
        app.wxRequest(url, data, function(res) {
          console.log('关注按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          let url2 = app.baseUrl + '/Api/Second_develop/active_details',
            data = {}
          data = {
            'ac_id': self.data.activityId,
            'open_id': app.globalData.openId
          }
          wx.showLoading()
          app.wxRequest(url2, data, function(res) {
            console.log('局部刷新关注', res)
            if (res.data.code == 1) {
              for (let i = 0; i < res.data.data.comment_data.length; ++i) {
                self.data.userCommentsList[i].focus_type = res.data.data.comment_data[i].focus_type
              }
              self.setData({
                'userCommentsList': self.data.userCommentsList
              })
              wx.hideLoading()
            }
          })
        })
      }
    }
  },
  // 点赞按钮
  likeBtnClick(e) {
    let self = this,
      url = app.baseUrl + '/interface/Comment/likes',
      data = {}
    let likedIdx = e.currentTarget.dataset.likedIdx,
      item = e.currentTarget.dataset.item,
      like = 0
    if (item.like_type == 1) {
      like = -1
    } else {
      like = 1
    }
    for (let i = 0; i < this.data.userCommentsList.length; ++i) {
      if (likedIdx == i) { // 判断当前点击的是那个按钮
        data = {
          'openid': app.globalData.openId,
          'id': item.id, // 单个评论所在列表中的id
          'type': like // 1点赞 0取消点赞
        }
        app.wxRequest(url, data, function(res) {
          console.log('点赞按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          let url2 = app.baseUrl + '/Api/Second_develop/active_details',
            data = {}
          data = {
            'ac_id': self.data.activityId,
            'open_id': app.globalData.openId
          }
          wx.showLoading()
          app.wxRequest(url2, data, function(res) {
            console.log('局部刷新点赞', res)
            if (res.data.code == 1) {
              for (let j = 0; j < res.data.data.comment_data.length; ++j) {
                self.data.userCommentsList[i].people = res.data.data.comment_data[i].people
                self.data.userCommentsList[i].like_type = res.data.data.comment_data[i].like_type
              }
              self.setData({
                'userCommentsList': self.data.userCommentsList
              })
              wx.hideLoading()
            }
          })
        })
      }
    }
  },
  // 评论按钮
  btn_pinglun(e) {
    let self = this,
      isPinglunAni = this.data.isPinglunAni,
      canPinglun = this.data.canPinglun
    if (isPinglunAni) {
      canPinglun = true
    } else {
      isPinglunAni = true
    }
    self.setData({
      'isPinglunAni': isPinglunAni,
    })
    if (canPinglun) {
      if (this.data.isLogin == 1) {
        var parameterStrng = '?typeNum=' + 1 + '&id=' + this.data.activityId
        app.navigateWx(this, '/package_readingStation/pages/commentRelay/commentRelay', parameterStrng)
      } else {
        wx.navigateTo({
          url: '/pages/forceLogin/forceLogin',
        })
      }
    }
  },
  btn_create_comment_hide() {
    this.setData({
      'isPinglunAni': false
    })
  },
  // 二级评论按钮
  btn_erjipinglun(e) {
    let item = e.currentTarget.dataset.item
    if (this.data.isLogin == 1) {
      var parameterStrng = '?typeNum=' + 5 + '&com_id=' + this.data.activityId + '&c_others=' + item.id
      app.navigateWx(this, '/package_readingStation/pages/erjipinglun/erjipinglun', parameterStrng)
    } else {
      wx.navigateTo({
        url: '/pages/forceLogin/forceLogin',
      })
    }
  },
  // 加入义工
  btn_join() {
    if (this.data.isLogin == 1) {
      console.log('加入义工bookId',this.data.bookId)
      wx.navigateTo({
        url: `/package_readingStation/pages/joinMeeting/joinMeeting?type=0&id=${this.data.activityId}&bookId=${this.data.bookId}`
        // url: '/package_readingStation/pages/joinMeeting/joinMeeting?type=0' + '&id=' + this.data.activityId + '&bookId=' + this.data.bookId
      })
    } else {
      wx.navigateTo({
        url: '/pages/forceLogin/forceLogin',
      })
    }
  },
  // 判断是否登录
  get_is_login: function(self) {
    wx.request({
      url: app.globalData.urlApi.getExist,
      data: {
        openid: app.globalData.openId
      },
      success: function(res) {
        console.log('2222', res)
        if (res.data.code == 1) {
          self.setData({
            isLogin: 1
          })
        } else {
          // self.setData({
          //   isLogin: -1
          // })
          wx.navigateTo({
            url: '/pages/forceLogin/forceLogin',
          })
        }
      }
    })
  },
  // 图片预览
  btn_preview: function(e) {
    console.log(e)
    let itemUrl = e.currentTarget.dataset.itemUrl,
      itemArr = e.currentTarget.dataset.itemArr
    for (let i = 0; i < itemArr.length; ++i) {
      itemArr[i] = app.ossImgUrl + itemArr[i]
    }
    wx.previewImage({
      current: app.ossImgUrl + itemUrl,
      urls: itemArr,
    })
  },
  // 查看书籍详情
  btn_go_book_information: function(e) {
    let self = this,
      libId = e.currentTarget.dataset.libId
    if (libId) {
      let parameterStrng = '?id=' + libId
      app.redirectWx(self, '/pages/libraryClass/bookLibraryInformation/bookLibraryInformation', parameterStrng)
    }
  },
  // 我要参与
  btn_person_confirm: function(e) {
    console.log(e)
    let self = this,
      personNamePro = self.data.personNamePro,
      personNameKey = self.data.personNameKey,
      JNum = personNamePro[1][e.detail.value[1]],
      district = personNamePro[3][e.detail.value[3]],
      id = self.data.activityId
    if (this.data.isLogin == -1) {
      wx.showToast({
        title: '您还没有登录，请登录后再试~',
        icon: 'none',
        duration: 1500
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/forceLogin/forceLogin',
        })
      }, 1500)
      return
    }
    wx.request({
      url: app.globalData.urlApi.getJoinActivity,
      data: {
        id: id,
        openid: app.globalData.openId,
        parents: JNum,
        child: district
      },
      success: function(res) {
        console.log(res);
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500,
        })
        if (res.data.code == 1) {
          setTimeout(function() {
            self.getPageDetail()
          }, 1000)
        }
      }
    })
    self.setData({
      personNameKey: e.detail.value
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
  // 参与列表
  toJoinPeople(e) {
    let activityId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/package_readingStation/pages/readingStation/joinPeopleSec/joinPeopleSec?activityId=' + activityId
    })
  }
})