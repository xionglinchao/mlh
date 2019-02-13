const app = getApp()

Page({
  data: {
    page: 1,  // 关注页面当前页码
    callbackcount: 10, //需要返回数据的个数
    bookList: [],  // 书本列表
  },
  onLoad: function (options) {
    this.setData({
      id: options.id || null
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getHotBookInfo()
  },
  onHide: function () {
    
  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getHotBookInfo()
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
  // 获取爆款更多列表信息
  getHotBookInfo() {
    let self = this, url = `${app.baseUrl}/interface/Shop/show_more`, data = {}
    data = {
      'id': this.data.id,
      'per_page': self.data.page,
      'limit': self.data.callbackcount
    }
    app.wxRequest(url, data, (res) => {
      console.log('爆款',res)
      if(res.data.code == 1) {
        res.data.data.info.litpic = app.ossImgUrl + res.data.data.info.litpic
        var contentlistTem = self.data.bookList
        if (self.data.page == 1) {
          contentlistTem = []
        }
        var bookList = res.data.data.shop
        if (bookList.length < self.data.callbackcount) {
          self.setData({
            'topInfo': res.data.data.info,
            'bookList': contentlistTem.concat(bookList),
            'hasMoreData': false
          })
        } else {
          self.setData({
            'topInfo': res.data.data.info,
            'bookList': contentlistTem.concat(bookList),
            'hasMoreData': true,
            'page': self.data.page + 1
          })
          console.log('分页加载', self.data.bookList)
        }
      }
    })
  },
  // 单本书详情跳转
  toBookDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/newLibrary/selectedBookInfo/selectedBookInfo?id=' + id,
    })
  },

  // 是否确认加入购物车
  add_car(e) {
    console.log(e)
    var that = this;
    let goodsCont = e.currentTarget.dataset.item
    wx.showModal({
      title: '提示',
      content: '是否加入购物车？',
      success: function(res) {
        if(res.confirm) {
          var goodsPro = app.globalData.goodsPro;
          var goodsNum = app.globalData.goodsNum;
          var dataInformation = goodsCont;
          var dataObj = {}
          goodsNum++;
          dataObj['name'] = dataInformation.name;
          dataObj['id'] = dataInformation.id;
          dataObj['litpic'] = dataInformation.litpic;
          dataObj['money'] = dataInformation.money;
          dataObj['moneys'] = dataInformation.moneys;
          dataObj['integral'] = dataInformation.integral;
          dataObj['num'] = 1;
          dataObj['isSelect'] = false;
          for (var i = 0; i < goodsPro.length; i++) {
            if (goodsPro[i].id == dataInformation.id) {
              goodsPro[i].num += 1;
            }
          }
          if (goodsPro['id' + dataInformation.id]) {
            goodsPro['id' + dataInformation.id]['num'] += 1;
          } else {
            goodsPro['id' + dataInformation.id] = dataObj;
          }
          // console.log(goodsPro);
          app.globalData.goodsPro = JSON.parse(JSON.stringify(goodsPro));
          app.globalData.goodsNum = goodsNum;
          that.setData({
            goodsNum: goodsNum,
          })
        }
      }
    })
  }
})