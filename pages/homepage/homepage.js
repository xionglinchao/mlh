const app = getApp()
let calendarSignData, calendarSignDay
Page({
  data: {
    'token': null,
    'baseImgURL': app.baseImgURL,
    'activityList': [],
    'iconTextList': [{
        'iconImg': 'https://meilihua.oss-cn-hangzhou.aliyuncs.com/program/images/home_icon_2.png',
        'iconText': '活动'
      },
      {
        'iconImg': 'https://meilihua.oss-cn-hangzhou.aliyuncs.com/program/images/home_icon_0.png',
        'iconText': '社区'
      },
      {
        'iconImg': 'https://meilihua.oss-cn-hangzhou.aliyuncs.com/program/images/home_icon_1.png',
        'iconText': '课程'
      },
      {
        'iconImg': 'https://meilihua.oss-cn-hangzhou.aliyuncs.com/program/images/home_icon_3.png',
        'iconText': '童书馆'
      },
      {
        'iconImg': 'https://meilihua.oss-cn-hangzhou.aliyuncs.com/program/images/home_icon_4.png',
        'iconText': '阅读树'
      },
    ],
    'wiseBean': ' ', // 签到获取豆数
    'wiseDay': ' ', // 签到的天数
    'ruleContent': [], // 规则介绍弹窗内容
    'isSignInHide': false, // 是否隐藏签到弹窗页面
    'isSignRuleHide': true, // 是否隐藏签到规则弹窗
    'isMysteriousGiftHide': true, // 隐藏神秘大礼弹窗
    'is_qd': false, // 是否已经签到
    'date': null, // 日历对象
    'calendarSignData': '', // 缓存已经签到的日期
    'calendarSignDay': '', // 缓存当天签到的日期
    'consecutiveDays': 0, // 连续签到的天数
    'hideStartPage': false,
    'loadNum': 0,
  },
  onLoad: function(options) {
    
  },
  onReady: function() {

  },
  onShow: function() {
    let that = this
    wx.getStorage({
      key: 'openID',
      success: function(res) {
        let token = res.data
        that.setData({token})
        that.getNewHomepageInfo()
      },
      fail: () => {
        // wx.navigateTo({
        //   url: '/pages/forceLogin/forceLogin',
        // })
      }
    })
    this.showCalendar()
    this.getUserSignInfo()

    if (new Date().getDate() == 1) { // 清除上月签到缓存
      wx.removeStorageSync('calendarSignData')
    }
    if (wx.getStorageSync('calendarSignData').indexOf(new Date().getDate()) > 0) {
      this.setData({
        'isSignInHide': true,
      })
    } else {
      this.setData({
        'isSignInHide': false,
      })
    }
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  //  日历
  showCalendar() {
    let mydate = new Date()
    let year = mydate.getFullYear()
    let month = mydate.getMonth() + 1
    this.data.date = mydate.getDate()
    // console.log('当天', this.data.date)
    let day = mydate.getDay()
    // console.log('星期', day)
    let nbsp = 7 - ((this.data.date - day - 1) % 7)
    if (nbsp >= 7) {
      nbsp = nbsp % 7
    }
    // console.log('nbsp', nbsp)
    let monthDaySize
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30
    } else if (month == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29
      } else {
        monthDaySize = 28
      }
    }
    this.setData({
      'year': year,
      'month': month,
      'nbsp': nbsp,
      'monthDaySize': monthDaySize,
      'date': this.data.date,
    })
  },
  // 点击签到事件
  calendarSign: function(e) {
    if (this.data.is_qd) {
      this.setData({
        'isSignInHide': true,
      })
      wx.navigateTo({
        url: '/package_find/pages/gongdujiPublish/picturePub/picturePub' // 跳转共读打卡页面
      })
      return
    }
    let self = this,
      url = app.baseUrl + '/Api/Sign/sign_in',
      data = {}
    data = {
      'open_id': app.globalData.openId,
    }
    app.wxRequest(url, data, function(res) {
      console.log('签到结果', res)
      if (res.data.code == 1) {
        if (res.data.data.score == 21 || res.data.data.score == 90 || res.data.data.score == 365) {
          self.setData({
            'isMysteriousGiftHide': false
          })
        }
        self.setData({
          'wiseBean': res.data.data.score, // 今日签到获取的豆数
          'wiseDay': res.data.data.count, // 总签到次数
          'is_qd': true
        })
        wx.showModal({
          title: '提示',
          content: '签到成功，请去共读社区赚积分哦',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 隐藏神秘大礼弹窗
  hideMystGift() {
    this.setData({
      'isMysteriousGiftHide': true
    })
  },
  // 获取用户签到信息
  getUserSignInfo() {
    // console.log('用户签到信息')
    let self = this,
      url = app.baseUrl + '/Api/Sign/sign_list',
      data = {}
    if (!app.globalData.openId) {
      var loadNum = self.data.loadNum
      if (loadNum > 3) {
        console.log('登录失败', app.globalData.openId)
        return
      }
      setTimeout(function() {
        self.getUserSignInfo()
        self.setData({
          loadNum: loadNum + 1
        })
      }, 1000)
    } else {
      data = {
        'open_id': app.globalData.openId,
      }
      // console.log(208, data)
      self.getSignDateList(url, data)
    }
  },
  // 获取用户签到日期列表
  getSignDateList(url, data) {
    let self = this
    app.wxRequest(url, data, function(res) {
      console.log('已签到的日期', res)
      if (res.data.code == 1) {
        let calendarSignData
        let calendarSignDay
        // 判断是否签到过
        if (res.data == null) {
          calendarSignData = new Array(self.data.monthDaySize).fill(0)
          wx.setStorageSync('calendarSignData', calendarSignData)
        } else {
          calendarSignData = new Array(self.data.monthDaySize).fill(0)
          for (var i in res.data.data.arr) {
            // for (let i = 0; i < res.data.data.arr.length; ++i) {
            parseInt(res.data.data.arr[i])
            calendarSignData[parseInt(res.data.data.arr[i])] = parseInt(res.data.data.arr[i])
            // console.log('当天的日期', self.data.date)
            // console.log('签到遍历的日期', parseInt(res.data.data.arr[i]))
            if (parseInt(res.data.data.arr[i]) == self.data.date) {
              wx.setStorageSync('calendarSignDay', 1)
              self.data.is_qd = true
            } else {
              wx.setStorageSync('calendarSignDay', 0)
            }
          }
          wx.setStorageSync('calendarSignData', calendarSignData)
        }
        // console.log(self.data.is_qd)
        calendarSignData = wx.getStorageSync('calendarSignData')
        calendarSignDay = wx.getStorageSync('calendarSignDay')
        if (calendarSignData.indexOf(new Date().getDate()) > 0) {
          self.setData({
            'isSignInHide': true,
          })
        } else {
          self.setData({
            'isSignInHide': false,
          })
        }
        self.setData({
          'is_qd': self.data.is_qd,
          'calendarSignData': calendarSignData,
          'calendarSignDay': calendarSignDay,
          'consecutiveDays': res.data.data.sign_times // 连续签到天数
        })
      }
    })
  },
  //签到弹窗事件
  showQianDaoPopup() {
    this.setData({
      'isSignInHide': !this.data.isSignInHide
    })
  },
  // 签到规则介绍弹窗事件
  showSignRulePopup: function(e) {
    this.setData({
      'isSignRuleHide': !this.data.isSignRuleHide
    })
    let self = this,
      url = app.baseUrl + '/Api/Sign/sign_rule',
      data = {}
    data = {
      'open_id': app.globalData.openId,
    }
    app.wxRequest(url, data, function(res) {
      console.log('规则', res)
      self.setData({
        'signRuleList': res.data.data.lists, // 签到规则
      })
    })
  },

  submit(e) {
    // console.log(e, 11111, e.detail.formId)
    let formId = e.detail.formId
    let self = this,
      url = `${app.baseUrl}/interface/Reading/get_formId`,
      data = {}
    data = {
      'form_id': formId,
      'openid': app.globalData.openId,
    }
    app.wxRequest(url, data, (res) => {
      console.log('获取formID', res)
    })
  },

  // 新版首页
  // 获取首页页面信息
  getNewHomepageInfo() {
    let system = wx.getStorageSync('system')
    let self = this,
      url = `${app.baseUrl}/interface/Index/lists`,
      data = {}
    data = {
      'openid': self.data.token,
      'vision': 1,
      'system': system
    }
    app.wxRequest(url, data, (res) => {
      console.log('新首页', res)
      if (res.data.code == 1) {
        for (let i = 0; i < res.data.data.broadcast.length; ++i) {
          res.data.data.broadcast[i].img = app.ossImgUrl + res.data.data.broadcast[i].img
        }
        wx.setStorageSync('vision',res.data.data.vision)
        let vision = wx.getStorageSync('vision')
        self.setData({
          'broadcast': res.data.data.broadcast,
          'community': res.data.data.list,
          'community_user': res.data.data.list.user,
          'active': res.data.data.active,
          'course': res.data.data.course_column_delicate,
          'vision': vision
        })
      }
    })
  },
  // 图标页面跳转
  toPage(e) {
    let self = this
    let idx = e.currentTarget.dataset.idx
    app.globalData.findIdx = idx
    switch (idx) {
      case 0:
        wx.navigateTo({
          url: '/package_find/pages/activityList/activityList',
        })
        break
      case 1:
        wx.switchTab({
          url: '/pages/discover/discover',
          success: function(e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
        break
      case 2:
        wx.switchTab({
          url: '/pages/discover/discover',
          success: function(e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
        break
      case 3:
        wx.navigateTo({
          url: '/pages/readingMall/readingMall',
        })
        break
      case 4:
        wx.navigateTo({
          url: '/package_readingTree/pages/readTrees/readTrees',
        })
        break
      default:
        ;
    }
  },
  // 社区动态跳转
  toCommunity() {
    app.globalData.findIdx = 1
    wx.switchTab({
      url: '/pages/discover/discover',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  // 发布详情跳转
  toPubDetail(e) {
    let articleId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/package_find/pages/gongdujiPublish/pubDetail/pubDetail?articleId=' + articleId,
    })
  },
  // 推荐活动跳转
  toAllActivity() {
    wx.navigateTo({
      url: '/package_find/pages/activityList/activityList',
    })
  },
  // 单个活动详情跳转
  toActivDetail(e) {
    let activityId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/package_find/pages/collectedDetail/collectedDetail?activityId=' + activityId,
    })
  },
  // 精选课程跳转
  toCourse() {
    app.globalData.findIdx = 2
    wx.switchTab({
      url: '/pages/discover/discover',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  // 单个课程详情跳转
  toCourseDetail(e) {
    let courseId = e.currentTarget.dataset.item.id
    let courseType = e.currentTarget.dataset.item.course_type
    if (courseType == 1) {
      wx.navigateTo({
        url: '/pages/audioVideoCourse/videoCourse/videoCourse?courseId=' + courseId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/audioVideoCourse/audioCourse/audioCourse?courseId=' + courseId,
      })
    }
  },
  // 社区动态关注
  subscribeBtnClick(e) {
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
      self.getNewHomepageInfo()
    })
  },

  // swiper
  jumpToPage(e) {
    console.log(e)
    if (e.currentTarget.dataset.item.type == 1) {
      wx.navigateTo({
        url: '/package_readingStation/pages/readingStation/readingActivityDetail/readingActivityDetail?activityId=' + e.currentTarget.dataset.item.list_id + '&bookId=' + e.currentTarget.dataset.item.id,
      })
    } else if (e.currentTarget.dataset.item.type == 2) {
      wx.navigateTo({
        url: '/package_find/pages/collectedDetail/collectedDetail?activityId=' + e.currentTarget.dataset.item.list_id,
      })
    } else if (e.currentTarget.dataset.item.type == 3) {
      wx.navigateTo({
        url: '/pages/goods/goods?id=' + e.currentTarget.dataset.item.list_id,
      })
    } else if (e.currentTarget.dataset.item.type == 4) {
      wx.navigateTo({
        url: '/package_readingTree/pages/readTrees/funGame/ciyubaida/cybd',
      })
    }
  },
})