const app = getApp()

Page({
  data: {
    discussIndex: -1, // 选择评论下标
    tabControlIndex: 0, // 选项卡下标 0 详情 1 评论 2 相关书籍
    isLockBoxHide: false, // 解锁弹窗隐藏
    isCollection: false, // 是否收藏
    isHideDeleteBtn: true, // 是否隐藏评论内容删除按钮
    commentList: [], // 评论列表
    isLoadingMore: false, // 是否正在加载更多数据
    curPage: 1, // 当前加载数据的页数
    allPages: 0, // 数据总的页数
    isDelete: false, // 是否显示删除按钮

  },
  onLoad: function(options) {
    this.setData({
      'singleCourseId': options.singleCourseId || null,
      'courseId': options.courseId || null
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getSingleCourseInfo()
    this.getCourseCommentInfo()
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
  
  //显示课程期数列表
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

  // 选项卡点击事件
  tabControlClick1() {
    this.setData({
      "tabControlIndex": 0
    })
  },
  tabControlClick2() {
    this.setData({
      "tabControlIndex": 1
    })
  },
  tabControlClick3() {
    this.setData({
      "tabControlIndex": 2
    })
  },

  // 解锁点击事件
  unlockBtnClick() {
    let self = this, url = `${app.baseUrl}/interface/Course/showCourseComment`, data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.singleCourseId,
    }
    app.wxRequest(url, data, (res) => {
      console.log(res)
      if(res.data.err_code == -1) {
        this.setData({
          'isLockBoxHide': !this.data.isLockBoxHide
        })
      } else {
        this.setData({
          'isLockBoxHide': false
        })
      }
    })
  },
  // 解锁关闭事件
  unlockHidePopup() {
    this.setData({
      'isLockBoxHide': !this.data.isLockBoxHide
    })
  },

  // 获取单个课程页面详情
  getSingleCourseInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/show_course`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.singleCourseId
    }
    app.wxRequest(url, data, (res) => {
      console.log('单个课程详情', res)
      if (res.data.err_code == 1) {
        res.data.data.source = app.ossImgUrl + res.data.data.source
        this.setData({
          'singleCourse': res.data.data,
          'writer': res.data.data.writer,
          'relativeBook': res.data.data.shop_data
        })
      }
    })
  },

  // 单个课程收藏
  singleCourseCollection() {
    let self = this, url = `${app.baseUrl}/interface/Course/collect_course`, data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.singleCourseId
    }
    app.wxRequest(url, data, (res) => {
      // console.log(res)
      self.setData({
        'isCollected': res.data.data.is_collect
      })
      self.getSingleCourseInfo()
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
    })
  },

  // 查看课程评论
  getCourseCommentInfo(page = null) {
    let self = this, url = `${app.baseUrl}/interface/Course/showCourseComment`, data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.singleCourseId,
      'per_page': page || this.data.curPage
    }
    // console.log(113, data)
    wx.showLoading({
      title: '正在加载中',
    })
    app.wxRequest(url, data, (res) => {
      console.log('评论内容',res)
      if(res.data.data.err_code = 1) {
        if(page > 1) {
          var commentList = self.data.commentList
          commentList = commentList.concat(res.data.data)
        } else {
          var commentList = []
        }
        self.setData({
          'commentList': res.data.data,
        })
      }
      wx.hideLoading()
    })
  },
  // 加载更多
  loadMore() {

  },

  // 评论内容删除功能
  deleteBtnLongPress(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id
    this.setData({
      'discussIndex': id
    })
  },

  // 删除按钮点击隐藏
  longPressBoxHide() {
    this.setData({
      'discussIndex': -1
    })
  },

  // 刪除评论
  delCommentBtn() {
    let self = this, url = `${app.baseUrl}/interface/Course/delComment`, data = {}
    data = {
      'openid': app.globalData.openId,
      'comment_id': this.data.discussIndex
    }
    app.wxRequest(url, data, (res) => {
      console.log('删除',res)
      if(res.data.err_code == 1) {
        wx.showToast({
          title: res.data.msg,
          duration: 1000,
          icon: 'none',
        })
      }
      // 跟新页面数据
      this.getCourseCommentInfo()
    })
  },
  // 发表评论
  bindValueInput(e) {
    // console.log(e)
    let self = this, url = `${app.baseUrl}/interface/Course/comment`, data = {}
    let content = e.detail.value
    data = {
      'openid': app.globalData.openId,
      'id': this.data.singleCourseId,
      'content': content,
    }
    if (content == '') {
      wx.showToast({
        title: '请出入内容',
        icon: 'none',
        duration: 1000,
      })
    } else {
      app.wxRequest(url, data, (res) => {
        console.log('发表评论', res)
        // 跟新页面数据
        this.getCourseCommentInfo()
      })
    }
  },
  // 相关书籍编辑按钮
  editBtn() {
    this.setData({
      'isDelete': !this.data.isDelete
    })
  },
  // 删除按钮
  delRelativeBook(e) {
    console.log(e)
    let bookId = e.currentTarget.dataset.item.id
    let self = this, url = `${app.baseUrl}/interface/Home_page/del_related_book`, data = {}
    data = {
      'openid': app.globalData.openId,
      'course_id': this.data.singleCourseId,
      'book_id': bookId
    }
    app.wxRequest(url, data, (res) => {
      console.log('删除结果',res.data.msg)
      // 更新页面数据
      self.getSingleCourseInfo()
    })
  },

  // 目录
  getViderCourseList() {
    let self = this,
      url = app.baseUrl + '/interface/Course/column_detail',
      data = {}
    data = {
      'id': this.data.courseId,
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, (res) => {
      console.log('目录', res)
      if (res.data.err_code == 1) {
        this.setData({
          'course': res.data.data.course,
        })
      }
    })
  },
})