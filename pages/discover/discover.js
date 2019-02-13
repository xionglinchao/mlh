const app = getApp()
const time = require('./time.js')

Page({
  data: {
    tTitle: [ // 选项卡标题
      '关注', '社区', '课程'
    ],
    rec_idx: 1, // 精选课程换一批当前页
    free_idx: 1,  // 免费课程换一批当前页
    page: 1,  // 关注页面当前页码
    callbackcount: 10, //需要返回数据的个数
    contentlist: [],  // 关注页面内容列表
    articleList: [],  // 社区页面内容列表
    vision: app.globalData.vision,
  },
  onLoad: function(options) {
    var findIdx = app.globalData.findIdx
    if (findIdx == 0 || findIdx == 1 || findIdx == 2) {
      var swiperIdx = findIdx
    } else {
      var swiperIdx = 1
    }
    let uID = null
    if (options && options.u_id) {
      uID = options.u_id
    }
    var vision = wx.getStorageSync('vision')
    this.setData({
      'u_id': uID,
      'swiperIdx': swiperIdx,
      'vision': vision
    })
  },
  onReady: function() {

  },
  onShow: function() {
    if (this.data.swiperIdx == 0) {
      this.getFocusInfo()
    } else if (this.data.swiperIdx == 1) {
      this.setData({
        'page': 1,
      })
      this.getPublickReading()
    } else {
      this.getCourseInfo()
      this.newUserGetWiseComb()
    }
    this.bindLowerLevel()
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {
    if (this.data.hasMoreData) {
      if (this.data.swiperIdx == 0) {
        this.getFocusInfo('加载更多数据')
      } else if (this.data.swiperIdx == 1) {
        this.getPublickReading('加载更多数据')
      }
    } else {
      // wx.showToast({
      //   title: '没有更多数据',
      //   icon: 'none',
      //   duration: 1000
      // })
    }
  },
  onShareAppMessage: function(res) {
    if (res.from == "button") {
      console.log('发现页面分享', res, this.data.mine)
      let articleId = res.target.dataset.id.id
      return {
        title: '美丽花亲子时光',
        path: '/package_find/pages/gongdujiPublish/pubDetail/pubDetail?articleId=' + articleId + '&u_id=' + this.data.mine,
      }
    } else {
      return {
        title: '美丽花亲子时光',
        path: '/pages/discover/discover?u_id=' + this.data.mine,
      }
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
      console.log('app.globalData.openId', app.globalData.openId, self.data.u_id)
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
  // 选项卡滑动
  changeSwiper(e) {
    let idx = e.currentTarget.dataset.idx
    this.setData({
      'swiperIdx': idx,
      'page': 1
    })
    if(idx == 0) {
      this.getFocusInfo()
    } else if (idx == 1) {
      this.getPublickReading()
    } else {
      this.getCourseInfo()
      this.newUserGetWiseComb()
    }
  },

  // 获取社区首页信息
  getPublickReading() {
    let self = this,
      url = `${app.baseUrl}/interface/Reading/publik_reading`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'per_page': this.data.page
    }
    app.wxRequest(url, data, (res) => {
      console.log('社区', res)
      if (res.data.code == 1) {
        res.data.data.article.cover = app.ossImgUrl + res.data.data.article.cover
        var contentlistTem = self.data.articleList
        if (self.data.page == 1) {
          contentlistTem = []
        }
        var articleList = res.data.data.lists
        if (articleList.length < self.data.callbackcount) {
          self.setData({
            'articleList': contentlistTem.concat(articleList),
            'hasMoreData': false,
            'randomArticle': res.data.data.article,
            'mine': res.data.data.mine,
            'active': res.data.data.active,
          })
        } else {
          self.setData({
            'articleList': contentlistTem.concat(articleList),
            'hasMoreData': true,
            'page': self.data.page + 1,
            'randomArticle': res.data.data.article,
            'mine': res.data.data.mine,
            'active': res.data.data.active,
          })
        }
      }
      console.log('articleList', self.data.articleList)
    })
  },
  // 社区关注按钮
  subscribeBtnClick(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.sucIdx
    let dom = `articleList[${index}].is_focus`
    let focus = item.is_focus === 0 ? 1 : 0
    let url = app.baseUrl + '/interface/Personal_center/whether_attention',
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': item.u_id,
      'type': focus // 1关注 0取消关注
    }
    app.wxRequest(url, data, (res) => {
      that.setData({
        [dom]: focus
      }),
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
    })
  },
  // 关注列表关注事件
  subscribeBtnClickFocus(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.sucIdx
    let dom = `contentlist[${index}].is_focus`
    let focus = item.is_focus === 0 ? 1 : 0
    let url = app.baseUrl + '/interface/Personal_center/whether_attention',
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': item.u_id,
      'type': focus // 1关注 0取消关注
    }
    app.wxRequest(url, data, (res) => {
      that.setData({
        [dom]: focus
      }),
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
    })
  },
  // 社区点赞按钮
  likeBtnClick(e) {
    console.log(e)
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.likedIdx
    let dom = `articleList[${index}].whether_like`
    let domNum = `articleList[${index}].like_num`
    let like = item.whether_like === 0 ? 1 : 0
    let like_num = item.whether_like == 1 ? Number(item.like_num) - 1:Number(item.like_num) + 1
    let url = `${app.baseUrl}//interface/Reading/like_reading`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': item.id, // 单个评论所在列表中的id
      'type': like // 1点赞 0取消点赞
    }
    app.wxRequest(url, data, (res) => {
      console.log('点赞', res)
      that.setData({
        [dom]: like,
        [domNum]: like_num
      }),
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
    })
  },
  // 关注列表点赞事件
  likeBtnClickFocus(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.likedIdx
    let dom = `contentlist[${index}].whether_like`
    let domNum = `contentlist[${index}].like_num`
    let like = item.whether_like === 0 ? 1 : 0
    let like_num = item.whether_like == 1 ? Number(item.like_num) - 1 : Number(item.like_num) + 1
    let url = `${app.baseUrl}//interface/Reading/like_reading`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': item.id, // 单个评论所在列表中的id
      'type': like // 1点赞 0取消点赞
    }
    app.wxRequest(url, data, (res) => {
      console.log('点赞', res)
      that.setData({
        [dom]: like,
        [domNum]: like_num
      }),
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
    })
  },
  // 创作按钮
  creationBtnClick() {
    wx.navigateTo({
      url: '/package_find/pages/gongdujiPublish/gongdujiPublish',
    })
  },
  // 精选文章列表跳转
  toSelectedArticleList() {
    wx.navigateTo({
      url: '/package_find/pages/bestSelected/bestSelected',
    })
  },
  // 文章详情跳转
  randomArticleDetailClick(e) {
    // console.log(e)
    let articleId = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/package_find/pages/selectedArticle/selectedArticle?articleId=' + articleId,
    })
  },
  singleArticleDetailClick(e) {
    let articleId = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/package_find/pages/gongdujiPublish/pubDetail/pubDetail?articleId=' + articleId,
    })
  },
  // 视频播放页面跳转
  toVideoPlayPage(e) {
    let videoPlay = e.currentTarget.dataset.item.video
    wx.navigateTo({
      url: '/pages/videoPlay/videoPlay?videoPlay=' + videoPlay,
    })
  },
  // 个人主页跳转
  toPersonalPage(e) {
    console.log(e)
    let id = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + id,
    })
  },

  // 改版课程页面
  // 顶部搜索栏
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  inputTyping: function(e) {
    var that = this;
    wx.request({
      url: app.baseUrl + '/interface/Course/course_index_search',
      data: {
        course_title: e.detail.value
      },
      success: function(res) {
        console.log('课程搜索结果', res)
        if (res.data.err_code == 1) {
          that.setData({
            serachPro: res.data.data
          })
        } else {
          that.setData({
            serachPro: []
          })
        }
      }
    })
  },
  btn_search_text: function(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    console.log(item);
    that.setData({
      isViewDisabled: true
    })
    wx.navigateTo({
      url: '/pages/audioVideoCourse/videoCourse/videoCourse?courseId=' + item.id,
    })
  },
  // 课程类型跳转
  toCourseType(e) {
    let idx = e.currentTarget.dataset.idx
    let courseType = e.currentTarget.dataset.id
    switch (idx) {
      case 0:
        wx.navigateTo({
          url: '/pages/audioVideoCourse/courseType/courseType?type=' + courseType,
        })
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/audioVideoCourse/courseType/courseType?type=' + courseType,
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/audioVideoCourse/courseType/courseType?type=' + courseType,
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/audioVideoCourse/courseType/courseType?type=' + courseType,
        })
        break;
      case 4:
        wx.navigateTo({
          url: '/pages/audioVideoCourse/courseType/courseType?type=' + courseType,
        })
        break;
    }
  },
  // 智慧书券弹窗
  hideMystGift() {
    this.setData({
      'isNewUser': false,
    })
  },
  confirmBtnClick() {
    this.setData({
      'isNewUser': false,
    })
  },
  // 课程页面详情
  getCourseInfo() {
    let self = this, url = `${app.baseUrl}/interface/Course/column_list1`, data = {}
    data = {
      per_page_delicate: this.data.rec_idx,
      per_page: this.data.free_idx,
      limit: 4
    }
    app.wxRequest(url, data, (res) => {
      console.log('课程首页', res)
      if(res.data.err_code == 1) {
        self.setData({
          'broadcast': res.data.data.course_broadcast,
          'courseType': res.data.data.course_type,
          'recommendCourse': res.data.data.course_column_delicate,
          'freeCourse': res.data.data.course_column_free,
          'rec_idx': res.data.data.current_page_delicate,
          'free_idx': res.data.data.current_page,
        })
      }
    })
  },
  // 课程类别详情跳转
  courseDetaliClick(e) {
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
  // 换一批
  next_page() {
    let rec_idx = Number(this.data.rec_idx) + 1
    this.setData({
      'rec_idx': rec_idx
    })
    console.log('换一批', this.data.rec_idx)
    // 更新页面数据
    this.getCourseInfo()
  },
  next_page_free() {
    let free_idx = Number(this.data.free_idx) + 1
    this.setData({
      'free_idx': free_idx
    })
    console.log('换一批', this.data.free_idx)
    // 更新页面数据
    this.getCourseInfo()
  },
  // 新用户智慧券弹窗
  newUserGetWiseComb() {
    let self = this, url = `${app.baseUrl}/interface/Course/user_get_wise_comb`, data = {}
    data = {
      'openid': app.globalData.openId,
    }
    app.wxRequest(url, data, (res) => {
      console.log('是否是新用户', res)
      this.setData({
        'isNewUser': res.data.err_code
      })
    })
  },
  // 课程页面轮播图跳转
  toCourseDetail(e) {
    let courseId = e.currentTarget.dataset.item.course_id
    let courseType = e.currentTarget.dataset.item.type
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
  // 精选活动 查看全部跳转
  toAllActivity() {
    wx.navigateTo({
      url: '/package_find/pages/activityList/activityList',
    })
  },
  toActivDetail(e) {
    let activityId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/package_find/pages/collectedDetail/collectedDetail?activityId=' + activityId,
    })
  },

  // 新版发现 我关注的内容
  getFocusInfo() {
    let self = this, url = `${app.baseUrl}/interface/Reading/my_follow`, data = {}
    data = {
      'openid': app.globalData.openId,
      'limit': self.data.callbackcount,
      'per_page': self.data.page
    }
    app.wxRequest(url, data, (res) => {
      console.log('关注页面', res)
      if(res.data.code == 1) {
        var contentlistTem = self.data.contentlist
        if (self.data.page == 1) {
          contentlistTem = []
        }
        var contentlist = res.data.data.lists
        if (contentlist.length < self.data.callbackcount) {
          self.setData({
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': false
          })
        } else {
          self.setData({
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': true,
            'page': self.data.page + 1
          })
        }
      }
    })
  },
})