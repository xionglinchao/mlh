const app = getApp()

Page({
  data: {
    isRuleIntroHide: true, // 是否隐藏智慧豆规则
    isFocused: false, // 是否已关注
    show: true,
    userId: null,
    curPage: 1,  // 当前第几页
    contentlist: [],  // 消息列表
    pageSize: 5,
  },
  onLoad: function(options) {
    let that = this
    if (options.scene) {
      let str = decodeURIComponent(options.scene)
      let scene = str.replace(/[^0-9]/ig, "")
      console.log('场景值', scene)
      that.setData({
        'id': scene,  // 被访问人id
        'scene': scene
      })
      app.data.upId = scene
      // that.bindLowerLevel()
      that.checkPartnerIdentity()
    } else {
      that.setData({
        'id': options.id || null,  // 被访问人id
      })
    } 
  },
  onReady: function() {

  },
  onShow: function() {
    this.getPersonalPageInfo()
    this.getPubListInfo()
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {
    if (this.data.hasMoreData) {
      this.getPubListInfo('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none',
        duration: 1000
      })
    }
  },
  onShareAppMessage: function(res) {
    if(res.from == 'menu') {
      return {
        title: '美丽花亲子时光',
        path: '/pages/personalHomepage/personalHomepage?id=' + this.data.userId
      }
    }
  },

  // 关注按钮
  focusBtnClick(e) {
    console.log(e)
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
      this.getPersonalPageInfo()
    })
  },
  // 私信
  leaveMessage() {
    var id = this.data.personalPage.id;
    var parameterStrng = '?id=' + id;
    app.navigateWx(this, '../leaveComments/leaveComments', parameterStrng);
  },
  // 智慧豆规则介绍点击事件
  ruleBtnClick() {
    this.setData({
      isRuleIntroHide: !this.data.isRuleIntroHide
    })
  },
  // 智慧豆规则介绍关闭事件
  showRulePopup() {
    this.setData({
      isRuleIntroHide: !this.data.isRuleIntroHide
    })
  },
  // 获取个人主页页面信息
  getPersonalPageInfo() {
    let vision = wx.getStorageSync('vision')
    let self = this,
      url = `${app.baseUrl}/interface/Home_page/homePage`,
      data = {}
    const app1 = getApp()
    if (!self.data.id) {
      data = {
        'openid': app1.globalData.openId,
      }
    } else {
      data = {
        'openid': app1.globalData.openId,
        'id': self.data.id
      }
    }
    app.wxRequest(url, data, (res) => {
      console.log('个人主页', res)
      if (res.data.code == 1) {
        // 若捐赠人数不满4人，则显示问号
        var qus = 4 - res.data.data.donation.length;
        var qusArr = [];
        for (var i = 0; i < qus; i++) {
          var a = i;
          qusArr.push(a);
        }
        res.data.data.qr_code = app.ossImgUrl + res.data.data.qr_code
        self.setData({
          'personalPage': res.data.data,
          'donation': res.data.data.donation,
          'qusArr': qusArr,
          'userId': res.data.data.id,
          'rule': res.data.data.rule,
          'open_id': res.data.data.openid ? res.data.data.openid : app.globalData.openId,
          'vision': vision
        })
      }
    })
  },
  // 分页加载
  getPubListInfo() {
    let self = this, url = `${app.baseUrl}/interface/Reading/page_reading`, data = {}
    data = {
      'openid': app.globalData.openId,
      'per_page': self.data.curPage,
      'limit': self.data.pageSize,
      'id': self.data.id
    }
    app.wxRequest(url, data, (res) => {
      console.log('分页加载',res)
      if(res.data.code == 1) {
        var contentlistTem = self.data.contentlist
        if (self.data.curPage == 1) {
          contentlistTem = []
        }
        var contentlist = res.data.data.lists
        if (contentlist.length < self.data.pageSize) {
          self.setData({
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': false
          })
        } else {
          self.setData({
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': true,
            'curPage': self.data.curPage + 1
          })
        }
      }
    })
  },
  // 打赏按钮
  rewardBtnClick() {
    let self = this,
      url = `${app.baseUrl}/interface/Home_page/donation`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': self.data.userId
    }
    app.wxRequest(url, data, (res) => {
      console.log('捐赠结果', res)
      switch (res.data.code) {
        case 1:
          self.setData({
            showModalStatus: true
          })
          setTimeout(function() {
            self.setData({
              showModalStatus: false
            })
          }, 2000)
          break;
        case -1:
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
          break;
        case -2:
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
          break;
        case -3:
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
          break;
        case -4:
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
          break;
      }
      // 刷新页面数据
      self.getPersonalPageInfo()
    })
  },
  // 捐赠榜单
  toPageDonateList() {
    console.log(this.data.userId)
    wx.navigateTo({
      url: '/pages/personalHomepage/donationList/donationList?userId=' + this.data.userId,
    })
  },
  // 相册详情页面
  toAblumDetailPage() {
    wx.navigateTo({
      url: '/pages/personalHomepage/photoAlbum/photoAlbum?userId=' + this.data.userId,
    })
  },
  // 课程列表页面
  toCourseListPage() {
    if (this.data.personalPage.course_num != 0) {
      wx.navigateTo({
        url: '/pages/personalHomepage/myCourse/myCourse?userId=' + this.data.userId,
      })
    }
  },
  // 二维码页面
  toQrCodePage() {
    if(this.data.id) {
      wx.navigateTo({
        url: '/pages/personalHomepage/erweima/erweima?id=' + this.data.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/personalHomepage/erweima/erweima?id=' + this.data.personalPage.id,
      })
    }
  },
  // 绑定上级
  bindLowerLevel() {
    if (this.data.id) {
      let self = this,
        url = `${app.baseUrl}/interface/UserInfo/user_bind_bdistribution`,
        data = {}
      data = {
        'open_id': app.globalData.openId,
        'u_id': self.data.id
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

  // 合伙人绑定情况跳转
  checkPartnerIdentity() {
    console.log('u_id123123', this.data.id, app.globalData.openId)
    this.interval = setInterval((res) => {
      if (app.globalData.openId) {
        clearInterval(this.interval)
        if (this.data.id) {
          let self = this, url = `${app.baseUrl}/interface/UserInfo/person_sao`, data = {}
          data = {
            'openid': app.globalData.openId,
            'u_id': self.data.id
          }
          app.wxRequest(url, data, (res) => {
            console.log('合伙人绑定情况', res)
            if (res.data.code == 1) {
              if (res.data.data.type == 1) {
                let u_sweep_id = res.data.data.u_sweep_id
                wx.navigateTo({
                  url: '/package_find/pages/gongdujiPublish/openCourse/openCourse?u_sweep_id=' + u_sweep_id,
                })
              }
              self.bindLowerLevel()
            }
          })
        }
      }
    },500)
  },

  // 文章详情跳转
  toAblumDetail(e) {
    let articleId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/package_find/pages/gongdujiPublish/pubDetail/pubDetail?articleId=' + articleId,
    })
  },
  toArticleDetail(e) {
    let articleId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/package_find/pages/selectedArticle/selectedArticle?articleId=' + articleId,
    })
  },

  // 关注列表跳转
  toFocusList() {
    wx.navigateTo({
      url: '/pages/myFollowPersonal/myFollowPersonal?followIndex=1' + '&open_id=' + this.data.open_id,
    })
  },
  toFocusList_sec() {
    wx.navigateTo({
      url: '/pages/myFollowPersonal/myFollowPersonal?followIndex=0' + '&open_id=' + this.data.open_id,
    })
  },

  // 兑换商城跳转
  exchangeBtnClick() {
    wx.navigateTo({
      url: '/package_find/pages/exchangeMall/exchangeMall',
    })
  },
  // 创作按钮
  creationBtnClick() {
    wx.navigateTo({
      url: '/package_find/pages/gongdujiPublish/gongdujiPublish',
    })
  },

  // 删除相册详情
  deleteBtnClick: function (e) {
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
              self.getPubListInfo()
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
  }
})