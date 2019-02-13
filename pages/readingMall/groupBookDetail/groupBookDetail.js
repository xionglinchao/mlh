const app = getApp()
const WxParse = require('../../../wxParse/wxParse.js');
const getTime = require('../../../utils/getTime.js');

Page({
  data: {
    isChooseTab: 1, // 选项卡选择 1 商品详情 0 最新心得
    goodsNum: 0
  },
  onLoad: function(options) {
    // this.setData({
    //   id: options.id || null, // 单本书id
    //   goodsNum: app.globalData.goodsNum
    // })
    let scene = decodeURIComponent(options.scene)
    console.log('场景值', scene, options)
    if (scene != 'undefined') {
      var sceneId = scene.split('&')[0].split('=')[1]
      var m_id = scene.split('&')[1].split('=')[1]
      var bookId = sceneId
    } else {
      var bookId = options.id
    }
    this.setData({
      'id': bookId || null,
      'u_id': m_id || options.u_id || null,
      'goodsNum': app.globalData.goodsNum
    })
    this.bindLowerLevel()
  },
  onReady: function() {

  },
  onShow: function() {
    this.getGroupBookDetail()
    this.getViewCommentInfo()
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function(res) {
    if (res.from == "button") {
      console.log('分享按钮', res)
      let bookId = res.target.dataset.item.id
      return {
        title: '美丽花亲子时光',
        path: '/pages/readingMall/groupBookDetail/groupBookDetail?id=' + bookId + '&u_id=' + this.data.mine,
      }
    }
  },

  // 商品详情点击事件
  tab1BtnClick() {
    this.setData({
      'isChooseTab': 1,
    })
  },
  // 最新新得
  tab2BtnClick() {
    this.setData({
      'isChooseTab': 0,
    })
  },
  // 获取单本书团购详情
  getGroupBookDetail() {
    let self = this,
      url = `${app.baseUrl}//interface/Shop/group_buy_details`,
      data = {}
    data = {
      'id': self.data.id,
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, (res) => {
      console.log('单本团购', res)
      if (res.data.code == 1) {
        res.data.data.shop.litpic1 = app.ossImgUrl + res.data.data.shop.litpic
        let group = res.data.data.group;
        let numTime = res.data.data.shop.price_time;
        if (group.length > 0) {
          const interval = setInterval(() => {
            for (var i = 0; i < group.length; i++) {
              let remainTime = getTime.getTime(group[i].time, numTime)
              // console.log(remainTime)
              if (remainTime <= 0) {
                clearInterval(interval)
                group[i]['remainingTime'] = group[i].time
              } else {
                remainTime--
                group[i]['remainingTime'] = getTime.transTime(parseInt(remainTime))
              }
            }
            self.setData({
              group: group,
            })
          }, 1000)
        }
        self.setData({
          'bookDetail': res.data.data.shop,
          'mine': res.data.data.mine
        })
        let article = res.data.data.shop.content;
        WxParse.wxParse('article', 'html', article, self, 5);
        self.friendCircleCode()
      }
    })
  },
  // 最新心得
  getViewCommentInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Comment/view_commments`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'com_id': this.data.id,
      'type': 0
    }
    app.wxRequest(url, data, (res) => {
      console.log('心得', res)
      if (res.data.code == 1) {
        this.setData({
          'tips': res.data.data
        })
      }
    })
  },
  // 底部收藏按钮
  collectClick() {
    let that = this,
      url = app.globalData.urlApi.addFavorites,
      data = {}
    let id = that.data.id,
      goodsCont = that.data.goodsCont
    data = {
      openid: app.globalData.openId,
      type: 0,
      id: id
    }
    app.wxRequest(url, data, (res) => {
      // console.log('收藏', res)
      if (res.data.code == -1) {
        // 刷新页面数据
        that.getGroupBookDetail()
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  btn_car: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/shopCar/shopCar',
    })
    // app.redirectWx(that, '/pages/shopCar/shopCar', '', true, '/pages/shopCar/shopCar');
  },
  // 单独购买
  btn_go_buy: function() {
    var that = this;
    var shop = that.data.bookDetail;
    var dataInformation = that.data.bookDetail;
    var dataPro = [];
    var dataObj = {};
    var isLogin = that.data.isLogin;
    that.setData({
      isViewDisabled: false
    })
    dataObj['name'] = dataInformation.name;
    dataObj['id'] = dataInformation.id;
    dataObj['litpic'] = dataInformation.litpic;
    dataObj['money'] = dataInformation.money;
    dataObj['moneys'] = dataInformation.moneys;
    dataObj['integral'] = dataInformation.integral;
    dataObj['num'] = 1;
    dataPro.push(dataObj);
    wx.navigateTo({
      url: '/pages/send/send?typeNum=6&dataPro=' + JSON.stringify(dataPro),
    })
  },
  // 拼团
  btn_send: function(e) {
    var that = this;
    var shop = that.data.bookDetail;
    var item = e.currentTarget.dataset.item;
    var dataInformation = that.data.bookDetail;
    var dataPro = [];
    var dataObj = {};
    var isLogin = that.data.isLogin;
    that.setData({
      isViewDisabled: false
    })
    dataObj['name'] = dataInformation.name;
    dataObj['id'] = dataInformation.id;
    dataObj['litpic'] = dataInformation.litpic;
    dataObj['money'] = dataInformation.money;
    dataObj['moneys'] = dataInformation.price;
    dataObj['kt_id'] = item.id;
    dataObj['people'] = dataInformation.price_people;
    dataObj['delegation_id'] = item.delegation_id
    dataObj['num'] = 1;
    dataPro.push(dataObj);
    wx.navigateTo({
      url: '/pages/send/send?typeNum=4&dataPro=' + JSON.stringify(dataPro),
    })
  },
  // 一键开团
  btn_k_t: function() {
    var that = this;
    var shop = that.data.bookDetail;
    var dataInformation = that.data.bookDetail;
    var dataPro = [];
    var dataObj = {};
    var isLogin = that.data.isLogin;
    that.setData({
      isViewDisabled: false
    })
    dataObj['name'] = dataInformation.name;
    dataObj['id'] = dataInformation.id;
    dataObj['litpic'] = dataInformation.litpic;
    dataObj['money'] = dataInformation.money;
    dataObj['moneys'] = dataInformation.price;
    dataObj['people'] = dataInformation.price_people;
    dataObj['num'] = 1;
    dataPro.push(dataObj);
    wx.navigateTo({
      url: '/pages/send/send?typeNum=5&dataPro=' + JSON.stringify(dataPro),
    })
  },


  //显示对话框
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

  // 朋友圈二维码
  friendCircleCode() {
    console.log('朋友圈二维码u_id',this.data.mine)
    let self = this,
      url = `${app.baseUrl}/interface/UserInfo/get_code_picture`,
      data = {}
    data = {
      'id': self.data.id,  // 书本id
      'type': 10,
      'u_id': self.data.mine
    }
    app.wxRequest(url, data, (res) => {
      console.log('朋友圈二维码', res)
      let img_url = app.ossImgUrl + res.data.img_url
      self.setData({
        'img_url': img_url
      })
    })
  },

  // 分享朋友圈
  shareFriendCircle() {
    let self = this
    if (!self.data.img_url) {
      wx.showLoading({
        title: '加载中',
        icon: 'loading'
      })
      self.hideModal()
      setTimeout(function() {
        self.shareFriendCircle()
      }, 2000)
    } else {
      wx.hideLoading()
      let imgArr = []
      let itemUrl = self.data.img_url
      imgArr.push(itemUrl)
      wx.previewImage({
        current: itemUrl, // 当前显示图片的http链接
        urls: imgArr, // 需要预览的图片http链接列表
      })
      console.log('itemUrl', itemUrl)
      self.hideModal()
    }
  },
  
  // 绑定上级
  bindLowerLevel() {
    console.log('绑定上级u_id',this.data.u_id)
    if (this.data.u_id) {
      let self = this,
        url = `${app.baseUrl}/interface/UserInfo/user_bind_bdistribution`,
        data = {}
      data = {
        'open_id': app.globalData.openId,
        'u_id': self.data.u_id
      }
      console.log('app.globalData.openId', app.globalData.openId, self.data.bind_open_id)
      if (!app.globalData.openId || app.globalData.openId === 'null') {
        setTimeout(function () {
          self.bindLowerLevel()
        }, 2000)
      } else {
        app.wxRequest(url, data, (res) => {
          console.log('绑定上级', res)
        })
      }
    }
  },
})