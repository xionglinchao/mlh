const app = getApp()

Page({
  data: {
    curPage: 1,  // 当前页码
    contentlist: [],  // 兑换列表
    pageSize: 7,
    hasMoreData: true,
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.getAllExchangeGoodsInfo()
  },
  onHide: function () {
    
  },
  onUnload: function () {
    
  },
  onPullDownRefresh: function () {
    
  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getAllExchangeGoodsInfo('加载更多数据')
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

  // 获取所有兑换商品列表
  getAllExchangeGoodsInfo() {
    let self = this, url = `${app.baseUrl}/interface/GiftShop/ordinary_gift`, data = {}
    data = {
      'limit': self.data.pageSize,
      'per_page': self.data.curPage
    }
    app.wxRequest(url, data, (res) => {
      console.log('所有兑换商品', res)
      if(res.data.code == 1) {
        for (let i = 0; i < res.data.data.ordinary_gift.length; ++i) {
          res.data.data.ordinary_gift[i].litpic = app.ossImgUrl + res.data.data.ordinary_gift[i].litpic
        }
        var contentlistTem = self.data.contentlist
        if (self.data.curPage == 1) {
          contentlistTem = []
        }
        var contentlist = res.data.data.ordinary_gift
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
  // 兑换按钮点击事件
  exchangeBtnClick(e) {
    wx.showModal({
      title: '提示',
      content: '是否确认兑换?',
      success: function (res) {
        if (res.confirm) {
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