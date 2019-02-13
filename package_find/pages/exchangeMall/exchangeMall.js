const app = getApp()

Page({
  data: {
    
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.getExchangeInfo()
  },
  onHide: function () {
    
  },
  onUnload: function () {
    
  },
  onPullDownRefresh: function () {
    
  },
  onReachBottom: function () {
    
  },
  onShareAppMessage: function () {
    
  },

  // 获取兑换商城首页信息
  getExchangeInfo() {
    let self = this, url = `${app.baseUrl}/interface/GiftShop/index`, data = {}
    data = {
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, (res) => {
      console.log('兑换商城',res)
      if(res.data.code == 1) {
        for (let i = 0; i < res.data.data.course_broadcast.length; ++i) {
          res.data.data.course_broadcast[i].img = app.ossImgUrl + res.data.data.course_broadcast[i].img
        }
        for (let i = 0; i < res.data.data.ordinary_gift.length; ++i) {
          res.data.data.ordinary_gift[i].litpic = app.ossImgUrl + res.data.data.ordinary_gift[i].litpic
        }
        self.setData({
          'swiperPic': res.data.data.course_broadcast,
          'wiseBean': res.data.data.integral,
          'timeGoods': res.data.data.limit_gift,
          'normalGoods': res.data.data.ordinary_gift
        })
      }
    })
  },

  // 所有兑换商品列表跳转
  toAllExchangeGoods() {
    wx.navigateTo({
      url: '/package_find/pages/exchangeList/allExchangeGoods/allExchangeGoods',
    })
  },
  // 限时商品列表跳转
  toTimeExchangeGoods() {
    wx.navigateTo({
      url: '/package_find/pages/exchangeList/timeExchangeGoods/timeExchangeGoods',
    })
  },
  // 抽奖活动跳转
  toLuckyDraw() {
    wx.navigateTo({
      url: '/pages/personalHomepage/luckyDraw/luckyDraw',
    })
  },
  // 兑换记录
  toExchangeRecordList() {
    wx.navigateTo({
      url: '/package_find/pages/exchangeList/exchangeRecord/exchangeRecord',
    })
  },

  // 兑换按钮点击事件
  exchangeBtnClick(e) {
    wx.showModal({
      title: '提示',
      content: '是否确认兑换?',
      success: function(res) {
        if(res.confirm) {
          let goodsId = e.currentTarget.dataset.id
          let self = this, url = `${app.baseUrl}/interface/GiftShop/exchange_gift`, data = {}
          data = {
            'openid': app.globalData.openId,
            'g_id': goodsId
          }
          app.wxRequest(url, data, (res) => {
            console.log('兑换结果', res)
            if (res.data.code == 1) {
              wx.showModal({
                title: '提示',
                content: '兑换成功，请到兑换记录中查看并联系客服提供相应信息',
              })
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
              })
            }
          })
        }
      }
    })
  }
})