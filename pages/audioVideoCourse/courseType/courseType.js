const app = getApp()

Page({
  data: {
    secTab: 0, // 标签下标
    curPage: 1,  // 当前第几页
    contentlist: [],  // 课程列表
    pageSize: 10,
    hasMoreData: true,
    secTabList: [
      '默认', '最新'
    ],
  },
  onLoad: function (options) {
    this.setData({
      'type': options.type || null,  // 课程类型
    })
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.getCoureTypeInfo()
  },
  onHide: function () {
    
  },
  onUnload: function () {
    
  },
  onPullDownRefresh: function () {
    
  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getCoureTypeInfo()
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1000
      })
    }
  },
  onShareAppMessage: function () {
    
  },

  // 选项卡点击
  tabClick(e) {
    let id = e.currentTarget.dataset.item.id
    this.setData({
      'type': id,  // 课程类型
      'curPage': 1,
      'secTab': 0,
    })
    // 页面更新
    this.getCoureTypeInfo()
  },

  // 获取页面信息
  getCoureTypeInfo() {
    let self = this, url = `${app.baseUrl}/interface/Course/course_search`, data = {}
    data = {
      'type': self.data.type,
      'status': self.data.secTab,
      'current_page': self.data.curPage,
      'limit': self.data.pageSize
    }
    app.wxRequest(url, data, (res) => {
      console.log('课程类型', res)
      if(res.data.err_code == 1) {
        for(let i = 0; i < res.data.data.course.length; ++i) {
          res.data.data.course[i].cover_img = app.ossImgUrl + res.data.data.course[i].cover_img
        }
        var contentlistTem = self.data.contentlist
        if (self.data.curPage == 1) {
          contentlistTem = []
        }
        var contentlist = res.data.data.course
        if (contentlist.length < self.data.pageSize) {
          self.setData({
            'courseType': res.data.data.course_type,
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': false
          })
        } else {
          self.setData({
            'courseType': res.data.data.course_type,
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': true,
            'curPage': self.data.curPage + 1
          })
        }
      }
    })
  },
  // 标签筛选
  secTabClick(e) {
    let idx = e.currentTarget.dataset.idx
    let self = this, url = `${app.baseUrl}/interface/Course/course_search`, data = {}
    data = {
      type: self.data.type,
      status: idx,
      current_page: self.data.curPage,
      limit: 10
    }
    app.wxRequest(url, data, (res) => {
      console.log('标签筛选', res)
      if (res.data.err_code == 1) {
        for (let i = 0; i < res.data.data.course.length; ++i) {
          res.data.data.course[i].cover_img = app.ossImgUrl + res.data.data.course[i].cover_img
        }
        self.setData({
          'secTab': idx,
          'contentlist': res.data.data.course
        })
      }
    })
  },
  // 课程类别详情跳转
  courseDetaliClick(e) {
    // console.log(e)
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
  // 搜索栏筛选
  getInputValue(e) {
    this.setData({
      'curPage': 1
    })
    let inputValue = e.detail.value
    let self = this, url = `${app.baseUrl}/interface/Course/course_search`, data = {}
    data = {
      'type': self.data.type,
      'course_title': inputValue,
      'current_page': self.data.curPage,
      'limit': 10
    }
    app.wxRequest(url, data, (res) => {
      console.log('搜索栏筛选', res)
      if (res.data.err_code == 1) {
        for (let i = 0; i < res.data.data.course.length; ++i) {
          res.data.data.course[i].cover_img = app.ossImgUrl + res.data.data.course[i].cover_img
        }
        self.setData({
          'contentlist': res.data.data.course,
          'secTab': 0
        })
      }
    })
  },
})