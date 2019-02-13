const app = getApp()
const time = require('./time.js')

Page({
  data: {
    curPage: 1, // 当前页码
    contentlist: [], // 兑换列表
    pageSize: 10,
    hasMoreData: true,
  },
  onLoad: function(options) {

  },
  onReady: function() {

  },
  onShow: function() {
    this.getTimeExchangeGoodsInfo()
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {
    if (this.data.hasMoreData) {
      this.getTimeExchangeGoodsInfo('加载更多数据')
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

  // 获取限时兑换商品列表
  getTimeExchangeGoodsInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/GiftShop/limit_gift`,
      data = {}
    data = {
      'limit': self.data.pageSize,
      'per_page': self.data.curPage
    }
    app.wxRequest(url, data, (res) => {
      console.log('限时兑换商品', res)
      if (res.data.code == 1) {
        let myDate = +(new Date()); // 获取系统当前时间戳
        console.log('myDate', myDate)
        for (let i = 0; i < res.data.data.limit_gift.length; ++i) {
          let endTime1 = res.data.data.limit_gift[i].end_time.replace(/\-/g, "/")
          let endTime = +(new Date(endTime1))
          let startTime1 = res.data.data.limit_gift[i].begin_time.replace(/\-/g, "/")
          let startTime = +(new Date(startTime1))
          // console.log('endTime', endTime)
          res.data.data.limit_gift[i].litpic = app.ossImgUrl + res.data.data.limit_gift[i].litpic
          if (myDate < startTime) {
            res.data.data.limit_gift[i].countDownText = self.addUnique(time.calculByEndDate(res.data.data.limit_gift[i].begin_time))
          } else if (myDate < endTime && myDate > startTime) {
            res.data.data.limit_gift[i].countDownText = self.addUnique(time.calculByEndDate(res.data.data.limit_gift[i].end_time))
          }
        }
        var contentlistTem = self.data.contentlist
        if (self.data.curPage == 1) {
          contentlistTem = []
        }
        var contentlist = res.data.data.limit_gift
        if (contentlist.length < self.data.pageSize) {
          self.setData({
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': false
          })
          setInterval(() => {
            for (let i = 0; i < res.data.data.limit_gift.length; ++i) {
              let endTime1 = res.data.data.limit_gift[i].end_time.replace(/\-/g, "/")
              let endTime = +(new Date(endTime1))
              let startTime1 = res.data.data.limit_gift[i].begin_time.replace(/\-/g, "/")
              let startTime = +(new Date(startTime1))
              if (myDate < startTime) {
                res.data.data.limit_gift[i].countDownText = self.addUnique(time.calculByEndDate(res.data.data.limit_gift[i].begin_time))
              } else if (myDate < endTime && myDate > startTime) {
                res.data.data.limit_gift[i].countDownText = self.addUnique(time.calculByEndDate(res.data.data.limit_gift[i].end_time))
              }
            }
            this.setData({
              'contentlist': contentlistTem.concat(contentlist),
            })
          }, 1000)
        } else {
          self.setData({
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': true,
            'curPage': self.data.curPage + 1
          })
          setInterval(() => {
            for (let i = 0; i < res.data.data.limit_gift.length; ++i) {
              let endTime1 = res.data.data.limit_gift[i].end_time.replace(/\-/g, "/")
              let endTime = +(new Date(endTime1))
              let startTime1 = res.data.data.limit_gift[i].begin_time.replace(/\-/g, "/")
              let startTime = +(new Date(startTime1))
              if (myDate < startTime) {
                res.data.data.limit_gift[i].countDownText = self.addUnique(time.calculByEndDate(res.data.data.limit_gift[i].begin_time))
              } else if (myDate < endTime && myDate > startTime) {
                res.data.data.limit_gift[i].countDownText = self.addUnique(time.calculByEndDate(res.data.data.limit_gift[i].end_time))
              }
            }
            this.setData({
              'contentlist': contentlistTem.concat(contentlist),
            })
          }, 1000)
        }
      }
    })
  },
  /**
   * 设置 wx:key 来指定列表中项目的唯一的标识符，提高渲染效率，解决waring
   * @params {String} ct counttime字符串 "dd:hh:mm:ss"
   */
  addUnique(ct) {
    return ct = ct.split('').map((n, idx) => Object.assign({}, {
      'text': n,
      'unique': `unique_${idx}`,
    }))
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