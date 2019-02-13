var app = getApp()
var moveXList = [0, 0] // X轴移动的距离
Page({
  data: {
    tabs: ["正在参与", "我发起的"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    relayPro: [],
    square_color: 0,
    startX: 0, // 开始坐标
    startY: 0,
    isViewDisabled: true
  },
  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          sliderLeft: res.windowWidth - (that.data.tabs.length - 0) * res.windowWidth / that.data.tabs.length,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          square_color: app.globalData.square_color
        })
      }
    })
  },
  onShow: function() {
    var that = this
    that.getMyRead()
    that.setData({
      isViewDisabled: true
    })
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
  },
  btn_publish: function(e) {
    this.setData({
      isViewDisabled: false
    })
    wx.navigateTo({
      url: '../publish/publish?info=' + e.currentTarget.dataset.info,
    })
  },
  getMyRead: function() {
    var that = this
    wx.request({
      url: app.globalData.urlApi.getMyActivity,
      data: {
        openid: app.globalData.openId
      },
      success: function(res) {
        console.log('我的活动',res)
        if (res.data.code == 1) {
          that.setData({
            relayPro: res.data.data
          })
        }
      }
    })
  },
  // 我参与的
  btn_activity_infomartion: function(e) {
    console.log(e)
    var that = this
    var parameterStrng = '?activityId=' + e.currentTarget.dataset.item.id + '&bookId=' + e.currentTarget.dataset.item.bookId
    app.navigateWx(that, '/package_readingStation/pages/readingStation/readingActivityDetail/readingActivityDetail', parameterStrng)
  },
  // 我发起的
  btn_activity_infomartion1: function(e) {
    var that = this
    // var parameterStrng1 = '?id=' + e.currentTarget.dataset.item.id
    var parameterStrng2 = '?activityId=' + e.currentTarget.dataset.item.id + '&bookId=' + e.currentTarget.dataset.item.bookId
    app.navigateWx(that, '/package_readingStation/pages/readingStation/readingActivityDetail/readingActivityDetail', parameterStrng2)
    // if (e.currentTarget.dataset.item.judgment == 1) {
    //   app.navigateWx(that, '/pages/myActivityInformation/myActivityInformation', parameterStrng1)
    // } else {
    //   app.navigateWx(that, '/package_readingStation/pages/readingStation/readingActivityDetail/readingActivityDetail', parameterStrng2)
    // }
  },
  // 手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    console.log(e)
    if (e.currentTarget.dataset.info == 1) {
      // 开始触摸时 重置所有删除
      this.data.relayPro.active.forEach(function(v, i) {
        if (v.isTouchMove) //只操作为true的
          v.isTouchMove = false
      })
    } else {
      this.data.relayPro.my_activities.forEach(function(v, i) {
        if (v.isTouchMove) // 只操作为true的
          v.isTouchMove = false
      })
    }
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      relayPro: this.data.relayPro
    })
  },
  // 滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, // 当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, // 滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, // 滑动变化坐标
      // 获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      })
    if (e.currentTarget.dataset.info == 1) {
      that.data.relayPro.active.forEach(function(v, i) {
        v.isTouchMove = false
        // 滑动超过30度角 return
        if (Math.abs(angle) > 30) return
        if (i == index) {
          if (touchMoveX > startX) // 右滑
            v.isTouchMove = false
          else // 左滑
            v.isTouchMove = true
        }
      })
    } else {
      that.data.relayPro.my_activities.forEach(function(v, i) {
        v.isTouchMove = false
        // 滑动超过30度角 return
        if (Math.abs(angle) > 30) return
        if (i == index) {
          if (touchMoveX > startX) // 右滑
            v.isTouchMove = false
          else // 左滑
            v.isTouchMove = true
        }
      })
    }
    // 更新数据
    that.setData({
      relayPro: that.data.relayPro
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
    // 返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
  },
  btn_delete: function(e) {
    var that = this
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '是否删除该活动或文章',
      success: function(res) {
        console.log(res)
        if (res.confirm) {
          wx.request({
            url: app.globalData.urlApi.deleteActivity,
            data: {
              id: e.currentTarget.dataset.item.id,
              type: e.currentTarget.dataset.info,
              openid: app.globalData.openId
            },
            success: function(res) {
              console.log(res)
              that.getMyRead()
              if (res.data.code != 1) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },
  btn_revise: function(e) {
    this.setData({
      isViewDisabled: false
    })
    console.log(e)
    wx.navigateTo({
      url: '../publish/publish?info=' + e.currentTarget.dataset.info.judgment + '&revise=1&item=' + JSON.stringify(e.currentTarget.dataset.info),
    })
  }
})