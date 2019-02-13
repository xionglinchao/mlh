const app = getApp()
let WxParse = require('../../../wxParse/wxParse.js')
Page({
  data: {
    reserve: 1, // ...
    baseInfo: null, // 头部信息
    line: 0, // 几条线进行中
    fTitle: [ // 选项卡标题
      '规则介绍', '最新心得', '火热接力', '相关书籍'
    ],
    swiperIdx: 0, // 当前选项卡索引
    ruleList: [], // 规则介绍
    bookIntroList: [], // 书籍介绍
    feelingList: [], // 最新心得
    relayList: [], // 火热接力
    relationBooksList: [], // 相关书籍
    isLogin: -1, // 是否注册过，-1为未注册，1为已注册
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      's_id': options.id
    })
    this.getBaseInfo(options.id, options.line)
    this.get_is_login(this)
  },
  onReady: function () {

  },
  onShow: function () {
    this.getRulesList()
    this.getFeeling()
    this.getRelayList()
    this.gegBookList()
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

  /**
   * 查看详情
   */
  look_detail(e) {
    let self = this, item = e.currentTarget.dataset.item, data = {};
    if (item.quantity == 0) return
    data = {
      'name': item.name,
      'contact': this.data.baseInfo.contact,
      'id': item.id,
      'litpic': item.litpic,
      'money': item.money,
      'moneys': item.moneys,
      'integral': item.integral,
      'num': 1
    }
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + data.id,
    })
  },

  // 获取基本信息
  getBaseInfo(id, line) {
    let self = this, url = app.globalData.urlApi.getReayBookInformation, data = {}
    data = {
      's_id': id,
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, function (res) {
      console.log('头部信息', res)
      self.setData({
        'baseInfo': res.data.data.information_data.shop,
        'reserve': res.data.data.reserve,
        'line': parseInt(line)
      })
    })
  },
  // 我要发起
  initiateBtnClick() {
    let self = this, baseInfo = this.data.baseInfo, data = {}, dataPro = []
    if (baseInfo.quantity > 0) {
      if (this.data.reserve == 0) {
        data = {
          'name': baseInfo.name,
          'contact': baseInfo.contact,
          'id': baseInfo.id,
          'litpic': baseInfo.litpic,
          'num': 1
        }
        dataPro.push(data)

        if (self.data.isLogin == 1) {
          wx.navigateTo({
            url: '../../send/send?typeNum=1&dataPro=' + JSON.stringify(dataPro) + '&money=' + baseInfo.contact,
          })
        } else {
          wx.navigateTo({
            url: '../../forceLogin/forceLogin',
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '您已参加过阅读，无法再次参与',
          showCancel: false
        })
      }

    } else {
      wx.showModal({
        title: '提示',
        content: '商品库存不足',
        showCancel: false
      })
    }
  },
  changeSwiper(e) {
    if (e.type == 'tap') { // tap 事件执行后 还会执行一次 change 事件，因此只需在change事件中去调取接口即可
      let idx = e.currentTarget.dataset.idx
      this.setData({ 'swiperIdx': idx })
    } else {
      let idx = e.detail.current
      switch (idx) {
        case 0:
          this.getRulesList()
          break
        case 1:
          this.getFeeling()
          break
        case 2:
          this.getRelayList()
          break
        case 3:
          this.gegBookList()
          break
        default: ;
      }
      this.setData({ 'swiperIdx': idx })
    }
  },
  // 关注按钮
  subscribeBtnClick(e) {
    let self = this, url = app.globalData.urlApi.whetherAttention, data = {}
    let sucIdx = e.currentTarget.dataset.sucIdx, item = e.currentTarget.dataset.item, focus = 0
    if (item.is_focus == 1) {
      focus = 0
    } else {
      focus = 1
    }
    for (let i = 0; i < this.data.feelingList.length; ++i) {
      if (sucIdx == i) {
        data = {
          'openid': app.globalData.openId,
          'id': item.u_id,
          'type': focus// 1关注 0取消关注
        }
        app.wxRequest(url, data, function (res) {
          console.log('关注按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          let url2 = app.baseUrl + '/interface/Comment/view_commments', data = {}
          data = {
            'com_id': 144,
            'type': 1,
            'openid': app.globalData.openId
          }
          wx.showLoading()
          app.wxRequest(url2, data, function (res) {
            console.log('局部刷新关注', res)
            if (res.data.code == 1) {
              for (let i = 0; i < res.data.data.length; ++i) {
                self.data.feelingList[i].is_focus = res.data.data[i].is_focus // 关注状态
              }
              self.setData({
                'feelingList': self.data.feelingList
              })
              wx.hideLoading()
            }
          })
        })
      }
    }
    this.setData({
      'feelingList': this.data.feelingList
    })
  },
  // 获取规则介绍
  getRulesList() {
    let self = this, url = app.baseUrl + '/Api/second_develop/relay_rules_detial', data = {}
    data = {
      'shop_id': this.data.s_id
    }
    app.wxRequest(url, data, function (res) {
      console.log('规则介绍', res)
      if (res.data.code == 1) {
        self.setData({
          'ruleList': res.data.data.rule,
          'bookIntroList': res.data.data.content
        })
        let article = res.data.data.content
        WxParse.wxParse('article', 'html', article, self, 5)
      }
    })
  },
  // 获取最新心得
  getFeeling() {
    let self = this, url = app.baseUrl + '/interface/Comment/view_commments', data = {}
    data = {
      'com_id': 144,
      'type': 1,
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, function (res) {
      console.log('最新心得', res)
      if (res.data.code == 1) {
        self.setData({
          'feelingList': res.data.data
        })
      }
    })
  },
  // 获取火热接力
  getRelayList() {
    let self = this, url = app.baseUrl + '/Api/Read_station/relay_routes', data = {}
    data = {
      'shop_id': this.data.s_id
    }
    app.wxRequest(url, data, function (res) {
      console.log('火热接力', res)
      if (res.data.code == 1) {
        self.setData({
          'relayList': res.data.data
        })
      }
    })
  },
  // 查看火热接力详情
  toRelayDetail(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    wx.navigateTo({
      url: '/pages/relayRead/relay-ending/relay-ending?user_id=' + item.userinfo.id + '&shop_id=' + this.data.s_id + '&contact_id=' + item.id,
    })
  },
  // 获取相关书籍
  gegBookList() {
    let self = this, url = app.baseUrl + '/Api/second_develop/relay_relation_book', data = {}
    data = {
      'shop_id': this.data.s_id
    }
    app.wxRequest(url, data, function (res) {
      console.log('相关书籍', res)
      if (res.data.code == 1) {
        self.setData({
          'relationBooksList': res.data.data
        })
      }
    })
  },
  // 购买书籍
  btn_go_buy(e) {
    let self = this, item = e.currentTarget.dataset.item, data = {}, dataPro = []
    if (item.quantity == 0) return
    if (self.data.isLogin == 1) {
      data = {
        'name': item.name,
        'contact': this.data.baseInfo.contact,
        'id': item.id,
        'litpic': item.litpic,
        'money': item.money,
        'moneys': item.moneys,
        'integral': item.integral,
        'num': 1
      }
      dataPro.push(data)
      wx.navigateTo({
        url: '../../send/send?typeNum=1&dataPro=' + JSON.stringify(dataPro) + '&money=' + item.moneys,
      })
    } else {
      wx.navigateTo({
        url: '../../forceLogin/forceLogin',
      })
    }
  },
  // 跳转用户信息页面
  btn_person_information: function (e) {
    var self = this;
    var item = e.currentTarget.dataset.item;
    var parameterStrng = '?id=' + item.u_id;
    app.navigateWx(self, '/pages/personalInformation/personalInformation', parameterStrng);
  },
  btn_person_information2: function (e) {
    var self = this;
    var item = e.currentTarget.dataset.item;
    var parameterStrng = '?id=' + item.id;
    app.navigateWx(self, '/pages/personalInformation/personalInformation', parameterStrng);
  },
  //判断是否登录
  get_is_login: function (self) {
    wx.request({
      url: app.globalData.urlApi.getExist,
      data: {
        'openid': app.globalData.openId
      },
      success: function (res) {
        console.log('是否登录', res)
        if (res.data.code == 1) {
          self.setData({
            'isLogin': 1
          })

        } else {
          self.setData({
            'isLogin': -1
          })
        }
      }
    })
  },
})