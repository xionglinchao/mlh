const app = getApp()

Page({
  data: {
    curPage: 1,  // 当前第几页
    contentlist: [],  // 消息列表
    pageSize: 5,
    hasMoreData: true,
    startX: 0, //开始坐标
    startY: 0
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.setData({
      'curPage': 1,
    })
    this.getMessageInfo()
  },
  onHide: function () {
    
  },
  onUnload: function () {
    
  },
  onPullDownRefresh: function () {
    
  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getMessageInfo('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none',
        duration: 1000
      })
    }
  },
  onShareAppMessage: function () {
    
  },
  // 获取消息首页信息
  getMessageInfo() {
    let self = this, url = `${app.baseUrl}/interface/news/message_index`, data = {}
    data = {
      'openid': app.globalData.openId,
      'limit': self.data.pageSize,
      'page': self.data.curPage
    }
    app.wxRequest(url, data, (res) => {
      console.log('消息首页', res)
      if (res.data.code == 1) {
        for (let i = 0; i < res.data.data.message.length; ++i) {
          res.data.data.message[i].isTouchMove = false
        }
        var contentlistTem = self.data.contentlist
        if (self.data.curPage == 1) {
          contentlistTem = []
        }
        var contentlist = res.data.data.message
        if (contentlist.length < self.data.pageSize) {
          self.setData({
            'news': res.data.data,
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': false
          })
        } else {
          self.setData({
            'news': res.data.data,
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': true,
            'curPage': self.data.curPage + 1
          })
        }
      }
    })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.contentlist.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      'contentlist': this.data.contentlist
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.contentlist.forEach(function (v, i) {
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
      'contentlist': that.data.contentlist
    })
  },
  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  // 消息类型页面跳转
  toMessageTypePage_1() {
    wx.navigateTo({
      url: '/pages/message/messageType/messageType?msg_type=1',
    })
  },
  toMessageTypePage_2() {
    wx.navigateTo({
      url: '/pages/message/messageType/messageType?msg_type=2',
    })
  },
  toMessageTypePage_3() {
    wx.navigateTo({
      url: '/pages/message/messageType/messageType?msg_type=3',
    })
  },
  // 消息删除点击事件
  delBtnClick(e) {
    let newsId = e.currentTarget.dataset.id
    let self = this, url = `${app.baseUrl}/interface/news/del_info`, data= {}
    data = {
      'id': newsId
    }
    app.wxRequest(url, data, (res) => {
      console.log('删除消息', res)
      if(res.data.code == 1) {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 1000,
        })
        self.setData({
          'curPage': 1,
        })
        // 更新页面数据
        self.getMessageInfo()
      }
    })
  },

  // 个人主页跳转
  toPersonalHomepage(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + id,
    })
  }
})