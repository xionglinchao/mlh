const app = getApp()
Page({
  data: {
    isRuleIntroHide: true, // 是否隐藏弹窗
    isHideChooseDot: true, // 是否隐藏选择按钮
    isHideSelected: true,  // 是否隐藏选中点
    list: [],
    rule: [],
    defaultList: [],
    
    panelList1: [],
    filterData: {
      theme: { // 主题
        mainColor: '#1EAC58', // 主色
        subColor: '#F5F5F5' // 辅色
      },
      filterShow: false, // 显示开关
      panelList: []
    }
  },
  onLoad: function(options) {
    if (app.globalData.isRuleIntroHide) {
      this.setData({
        isRuleIntroHide: true
      })
      app.globalData.isRuleIntroHide = true
    } else {
      this.setData({
        isRuleIntroHide: false
      })
    }
  },
  onReady: function() {

  },
  onShow: function() {
    this.getList()
    this.getFilterDataInfo()
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
  // 规则介绍关闭事件
  showRulePopup() {
    this.setData({
      'isRuleIntroHide': !this.data.isRuleIntroHide
    })
    app.globalData.isRuleIntroHide = true
  },
  // 选择分销课程
  chooseCourseClick() {
    this.setData({
      'isHideChooseDot': !this.data.isHideChooseDot
    })
  },
  // 取消选择
  cancelBtnClick() {
    this.setData({
      'isHideChooseDot': true,
      'isHideSelected': true,
    })
  },
  // 全选
  allChooseClick() {
    // this.setData({
    //   'isHideSelected': false,
    // })
    var list = this.data.list
    for (var i = 0; i < list.length; i++) {
      list[i].selected = true
    }
    console.log(list, 'listlistlist')
    this.setData({
      list: list
    })
  },
  // 获取课程列表
  getList () {
    var that = this
    var url = app.baseUrl + '/interface/Course/distribute', data = {}
    app.wxRequest(url, data, function (res) {
      if (res.data.code == 1) {
        console.log('分销课程列表',res)
        var list = res.data.data.column
        var defaultList = res.data.data.default
        for (var i = 0; i < list.length; i++) {
          for (var j = 0; j < defaultList.length; j++) {
            if (list[i].id == defaultList[j]) {
              list[i].selected = true
            }
          }
        }
        that.setData({
          list: res.data.data.column,
          rule: res.data.data.rule,
          defaultList: res.data.data.default
        })
      }
    })
  },
  // 获取课程列表
  getList2(e) {
    var that = this
    var keyword = e.detail.value
    var url = app.baseUrl + '/interface/Course/search_distribute'
    var data = {
      keyword: keyword
    }
    app.wxRequest(url, data, function (res) {
      if (res.data.code == 1) {
        var list = res.data.data.column
        var defaultList = that.data.defaultList
        for (var i = 0; i < list.length; i++) {
          for (var j = 0; j < defaultList.length; j++) {
            if (list[i].id == defaultList[j]) {
              list[i].selected = true
            }
          }
        }
        that.setData({
          list: res.data.data.column
        })
      }
    })
  },
  // 点击课程item
  clickItem (e) {
    var id = e.currentTarget.id
    var that = this
    var index = e.currentTarget.dataset.index
    if (!id) {
      return
    }
    if (this.data.isHideChooseDot) {
      wx.navigateTo({
        url: '../../../../pages/audioVideoCourse/videoCourse/videoCourse?courseId=' + id,
      })
    } else {
      that.data.list[index].selected = !that.data.list[index].selected
      that.setData({
        list: that.data.list
      })
    }
  },
  // 提交要分销的课程
  submitSelect () {
    var list = this.data.list
    var selectedList = []
    for (var i = 0; i < list.length; i++) {
      if (list[i].selected) {
        selectedList.push(list[i].id)
      }
    }
    console.log(selectedList, 'selectedList')
    var url = app.baseUrl + '/interface/Course/submit_distribute'
    var data = {
      openid: app.globalData.openId,
      courses: selectedList
    }
    app.wxRequest(url, data, function (res) {
      if (res.data.code == 1) {
        console.log(res, 213123131)
        wx.showToast({
          title: '课程选择成功！',
          duration: 1500,
          mask: true
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 3
          })
        }, 1500)
      }
    })
  },
  // 获取侧边滑动栏信息
  getFilterDataInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/screen`,
      data = {}
    app.wxRequest(url, data, (res) => {
      console.log('侧边栏', res, res.data.data, self.data)
      let panelList = self.data.filterData.panelList
      if (res.data.code == 1) {
        this.setData({
          'panelList': res.data.data
        })
        self.selectComponent('#filter').init()
      }
    })
  },
  // 筛选组件回调
  filterCallback(e) {
    console.log('筛选组件数据', e.detail, this.data.panelList.length)
    var list = e.detail.filterKeyword
    if (list.length < this.data.panelList.length) {
      wx.showToast({
        title: '请选择条件',
        icon: 'none'
      })
    } else {
      let that = this,
        url = `${app.baseUrl}/interface/Course/screen_lists`,
        data = {
          'course_type': list[0] == '音频课程' ? '0' : list[0].value,
          'type': list[1] == '免费' ? '0' : list[1].value,
          // 'course_type': 0,
          // 'type': 1
        }
      app.wxRequest(url, data, (res) => {
        console.log('筛选结果',res)
        if (res.data.code == 1) {
          var list = res.data.data.column
          var defaultList = that.data.defaultList
          for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < defaultList.length; j++) {
              if (list[i].id == defaultList[j]) {
                list[i].selected = true
              }
            }
          }
          that.setData({
            list: res.data.data.column
          })
        }
      })
    }
  },
  // 筛选组件开关
  slideFilterClick() {
    wx.hideTabBar()
    this.setData({
      'filterData.filterShow': true
    })
  },
  // 筛选页面跳转
  _confirmBtnTap() {
    
  },
})