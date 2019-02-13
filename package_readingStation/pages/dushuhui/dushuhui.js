var WxParse = require('../../../wxParse/wxParse.js');

const app = getApp()
Page({
  data: {
    bookId: -1,
    baseInfo: null,
    tTitle: ['读书活动', '团队介绍', '评论'],
    renyuanList: [], // 人员介绍
    activityList: [], // 读书活动
    userCommentsList: [], // 用户评论列表
    swiperIdx: 0
  },
  onLoad(ops) {
    // console.log(ops)
    this.setData({
      'bookId': ops.bookId,
      'lat': ops.lat,
      'lng': ops.lng
    })
  },
  onShow() {
    this.get_is_login(this)
    this.getRenyuanList()
    this.getActivityList()
    this.getCommentList()
  },
  changeSwiper(e) {
    if (e.type == 'tap') {
      let idx = e.currentTarget.dataset.idx
      this.setData({ 'swiperIdx': idx })
    } else {
      let idx = e.detail.current
      switch (idx) {
        case 0:
          this.getActivityList()
          break
        case 1:
          this.getRenyuanList()
          break
        case 2:
          this.getCommentList()
          break
      }
      this.setData({ 'swiperIdx': idx })
    }
  },
  // 读书会关注按钮
  baseSucBtnClick(e) {
    let self = this, url = app.baseUrl + '/interface/Personal_center/whether_attention', data = {}
    let sucIdx = e.currentTarget.dataset.sucIdx, item = e.currentTarget.dataset.item, focus = 0
    if (item.type == 1) {
      focus = 0
    } else {
      focus = 1
    }
    data = {
      'openid': app.globalData.openId,
      'id': item.clt_id,
      'type': focus// 1关注 0取消关注
    }
    app.wxRequest(url, data, function (res) {
      console.log('关注按钮', res.data.msg)
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
      // 更新页面数据
      let url2 = app.baseUrl + '/Api/second_develop/active_person_lists', data = {}
      data = {
        'book_id': self.data.bookId,
        'open_id': app.globalData.openId
      }
      wx.showLoading()
      app.wxRequest(url2, data, function (res) {
        console.log('局部刷新关注', res)
        if (res.data.code == 1) {
          res.data.data.book_data.logs = app.ossImgUrl + res.data.data.book_data.logs
          self.setData({
            'baseInfo': res.data.data.book_data
          })
          wx.hideLoading()
        }
      })
    })
  },
  // 获取人员列表
  getRenyuanList() {
    let self = this, url = app.baseUrl + '/Api/second_develop/active_person_lists', data = {}
    data = {
      'book_id': this.data.bookId,
      'open_id': app.globalData.openId
    }
    app.wxRequest(url, data, function (res) {
      console.log('人员列表', res)
      if (res.data.code == 1) {
        res.data.data.book_data.logs = app.ossImgUrl + res.data.data.book_data.logs
        self.setData({
          'baseInfo': res.data.data.book_data,
          'renyuanList': res.data.data.user_info
        })
      }
    })
  },
  // 关注按钮
  subscribeBtnClick(e) {
    let self = this, url = app.baseUrl + '/interface/Personal_center/whether_attention', data = {}
    let sucIdx = e.currentTarget.dataset.sucIdx, item = e.currentTarget.dataset.item, focus = 0
    if (item.type == 1) {
      focus = 0
    } else {
      focus = 1
    }
    for (let i = 0; i < this.data.renyuanList.length; ++i) {
      if (sucIdx == i) {
        data = {
          'openid': app.globalData.openId,
          'id': item.id,
          'type': focus// 1关注 0取消关注
        }
        app.wxRequest(url, data, function (res) {
          console.log('关注按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          let url2 = app.baseUrl + '/Api/second_develop/active_person_lists', data = {}
          data = {
            'book_id': self.data.bookId,
            'open_id': app.globalData.openId
          }
          wx.showLoading()
          app.wxRequest(url2, data, function (res) {
            console.log('局部刷新关注', res)
            if (res.data.code == 1) {
              for (let i = 0; i < res.data.data.user_info.length; ++i) {
                self.data.renyuanList[i].type = res.data.data.user_info[i].type
              }
              self.setData({
                'renyuanList': self.data.renyuanList
              })
              wx.hideLoading()
            }
          })
        })
      }
    }
  },
  // 获取读书活动列表
  getActivityList() {
    // wx.showLoading({
    //   title: '加载中',
    // })
    let self = this, url = app.baseUrl + '/Api/Second_develop/read_club_active', data = {}
    data = {
      'book_id': this.data.bookId,
      // 'book_id': 62,
      'lat': this.data.lat,
      'lng': this.data.lng
    }
    app.wxRequest(url, data, function (res) {
      console.log('活动列表', res)
      if (res.data.code == 1) {
        self.setData({
          'activityList': res.data.data
        })
        // wx.hideLoading()
      }
    })
  },
  // 获取评论列表
  getCommentList() {
    let self = this, url = app.baseUrl + '/Api/second_develop/read_club_comment', data = {}
    data = {
      'book_id': this.data.bookId,
      'open_id': app.globalData.openId
    }
    app.wxRequest(url, data, function (res) {
      console.log('评论列表', res)
      if (res.data.code == 1) {
        self.setData({
          'userCommentsList': res.data.data
        })
      }
    })
  },
  // 评论关注按钮
  subscribeBtnClick2(e) {
    let self = this, url = app.baseUrl + '/interface/Personal_center/whether_attention', data = {}
    let sucIdx = e.currentTarget.dataset.sucIdx, item = e.currentTarget.dataset.item, focus = 0
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
          'type': focus// 1关注 0取消关注
        }
        app.wxRequest(url, data, function (res) {
          console.log('关注按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          let url2 = app.baseUrl + '/Api/second_develop/read_club_comment', data = {}
          data = {
            'book_id': self.data.bookId,
            'open_id': app.globalData.openId
          }
          wx.showLoading()
          app.wxRequest(url2, data, function (res) {
            console.log('局部刷新关注', res)
            if (res.data.code == 1) {
              for (let i = 0; i < res.data.data.length; ++i) {
                self.data.userCommentsList[i].focus_type = res.data.data[i].focus_type
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
    let self = this, url = app.baseUrl + '/interface/Comment/likes', data = {}
    let likedIdx = e.currentTarget.dataset.likedIdx, item = e.currentTarget.dataset.item, like = 0
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
        app.wxRequest(url, data, function (res) {
          console.log('点赞按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          let url2 = app.baseUrl + '/Api/second_develop/read_club_comment', data = {}
          data = {
            'book_id': self.data.bookId,
            'open_id': app.globalData.openId
          }
          wx.showLoading()
          app.wxRequest(url2, data, function (res) {
            console.log('局部刷新点赞', res)
            if (res.data.code == 1) {
              for (let j = 0; j < res.data.data.length; ++j) {
                self.data.userCommentsList[i].people = res.data.data[i].people
                self.data.userCommentsList[i].like_type = res.data.data[i].like_type
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
  // 二级评论按钮
  btn_erjipinglun(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    if (this.data.isLogin == 1) {
      var parameterStrng = '?typeNum=' + 5 + '&com_id=' + item.com_id + '&c_others=' + item.id
      app.navigateWx(this, '/pages/pinglunzhengji/erjipinglun/erjipinglun', parameterStrng)
    } else {
      wx.navigateTo({
        url: '/pages/forceLogin/forceLogin',
      })
    }
  },
  // 加入义工
  btn_join() {
    if (this.data.isLogin == 1) {
      wx.navigateTo({
        url: '/package_readingStation/pages/joinMeeting/joinMeeting?type=0&id=' + this.data.bookId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/forceLogin/forceLogin',
      })
    }
  },
  // 跳转用户信息页面
  btn_person_information: function (e) {
    var self = this
    var item = e.currentTarget.dataset.item
    var parameterStrng = '?id=' + item.id
    app.navigateWx(self, '/pages/personalInformation/personalInformation', parameterStrng)
  },
  btn_person_information2: function (e) {
    var self = this
    var item = e.currentTarget.dataset.item
    var parameterStrng = '?id=' + item.t_id
    app.navigateWx(self, '/pages/personalInformation/personalInformation', parameterStrng)
  },
  btn_person_information3: function (e) {
    var self = this
    var item = e.currentTarget.dataset.item
    var parameterStrng = '?id=' + item.u_id
    app.navigateWx(self, '/pages/personalInformation/personalInformation', parameterStrng)
  },
  btn_leave_comments: function (e) { //留言
    var id = e.currentTarget.dataset.id
    var parameterStrng = '?id=' + id
    app.navigateWx(this, '/pages/leaveComments/leaveComments', parameterStrng)
  },
  // 判断是否登录
  get_is_login: function (self) {
    wx.request({
      url: app.globalData.urlApi.getExist,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          self.setData({
            isLogin: 1
          })
        } else {
          self.setData({
            isLogin: -1
          })
        }
      }
    })
  },
  // 跳转读书会详情
  toRaDetail(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/package_readingStation/pages/readingStation/readingActivityDetail/readingActivityDetail?activityId=' + item.id,
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
})