const app = getApp()

Page({
  data: {
    startX: 0, //开始坐标
    startY: 0,
    curPage: 1, // 当前页码
    contentlist: [],  // 消息列表
    pageSize: 10,
    hasMoreData: true,  // 是否需要加载分页
  },
  onLoad: function(options) {
    this.setData({
      'msg_type': options.msg_type
    })
  },
  onReady: function() {

  },
  onShow: function() {
    if (this.data.msg_type == 1) {
      this.getPlatformNewsInfo()
    } else if (this.data.msg_type == 2){
      this.getDynamicNewsInfo()
    } else {
      this.getPersonalNewsListInfo()
    }
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {
    if (this.data.hasMoreData) {
      if (this.data.msg_type == 1) {
        this.getPlatformNewsInfo('加载更多数据')
      } else if (this.data.msg_type == 2) {
        this.getDynamicNewsInfo('加载更多数据')
      } else {
        this.getPersonalNewsListInfo('加载更多数据')
      }
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none',
        duration: 1000
      })
    }
  },
  onShareAppMessage: function() {

  },
  // 获取平台消息列表
  getPlatformNewsInfo() {
    let self = this, url = `${app.baseUrl}/interface/news/system_info`, data = {}
    data = {
      'openid': app.globalData.openId,
      'limit': self.data.pageSize,
      'page': self.data.curPage
    }
    app.wxRequest(url, data, (res) => {
      console.log('平台消息', res)
      if (res.data.code == 1) {
        for (let i = 0; i < res.data.data.length; ++i) {
          res.data.data[i].isTouchMove = false
        }
        var contentlistTem = self.data.contentlist
        if (self.data.curPage == 1) {
          contentlistTem = []
        }
        var contentlist = res.data.data
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
  // 获取私信消息列表
  getPersonalNewsListInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/news/person_info`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'limit': self.data.pageSize,
      'page': self.data.curPage
    }
    app.wxRequest(url, data, (res) => {
      console.log('私信消息', res)
      if (res.data.code == 1) {
        for (let i = 0; i < res.data.data.length; ++i) {
          res.data.data[i].isTouchMove = false
        }
        var contentlistTem = self.data.contentlist
        if (self.data.curPage == 1) {
          contentlistTem = []
        }
        var contentlist = res.data.data
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
  // 获取动态消息
  getDynamicNewsInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/news/dynamic_info`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'limit': self.data.pageSize,
      'page': self.data.curPage
    }
    app.wxRequest(url, data, (res) => {
      console.log('动态消息', res)
      if (res.data.code == 1) {
        for (let i = 0; i < res.data.data.dynamic_info.length; ++i) {
          res.data.data.dynamic_info[i].isTouchMove = false
        }
        var contentlistTem = self.data.contentlist
        if (self.data.curPage == 1) {
          contentlistTem = []
        }
        var contentlist = res.data.data.dynamic_info
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
  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.contentlist.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      contentlist: this.data.contentlist
    })
  },
  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.contentlist.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      contentlist: that.data.contentlist
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  // 删除消息点击事件
  delBtnClick(e) {
    let newsId = e.currentTarget.dataset.id
    let self = this, url = `${app.baseUrl}/interface/news/del_info`, data = {}
    data = {
      'id': newsId
    }
    app.wxRequest(url, data, (res) => {
      console.log('删除消息', res)
      if(res.data.code == 1) {
        // 更新页面数据
        if (self.data.msg_type == 1) {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 1000,
          })
          self.setData({
            'curPage': 1
          })
          self.getPlatformNewsInfo()
        } else if (self.data.msg_type == 2) {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 1000,
          })
          self.getDynamicNewsInfo()
        } else {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 1000,
          })
          self.getPersonalNewsListInfo()
        }
      }
    })
  },
  // 私信消息回复
  replyPersonalNews(e) {
    let userId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/leaveComments/leaveComments?id=' + userId,
    })
  },

  // 动态关注
  btn_attention: function (e) {
    let that = this, url = app.baseUrl + '/interface/Personal_center/whether_attention', data = {}
    let sucIdx = e.currentTarget.dataset.sucIdx, item = e.currentTarget.dataset.item, focus = 0
    if (item.is_focus == 0) {
      focus = 1
    } else {
      focus = 0
    }
    for (let i = 0; i < that.data.contentlist.length; ++i) {
      if (sucIdx == i) { // 判断当前是哪个按钮
        data = {
          'openid': app.globalData.openId,
          'id': item.c_others,
          'type': focus // 1关注 0取消关注
        }
        app.wxRequest(url, data, function (res) {
          console.log('关注按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          that.getDynamicNewsInfo();
        })
      }
    }
  },
  // 个人主页跳转
  toPersonalHomepage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + id,
    })
  }
})