const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');

Page({
  data: {
    isChooseTab: 1, // 选项卡选择 1 商品详情 0 最新心得
    goodsNum: 0,
    hidden: true
  },
  onLoad: function(options) {
    // this.setData({
    //   id: options.id || null,
    //   goodsNum: app.globalData.goodsNum,
    //   u_id: options.u_id ? options.u_id: ''
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
    this.getBookDetailInfo()
    this.getViewCommentInfo()
  },
  onHide: function() {
    this.setData({
      hidden: true
    })
  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function(res) {
    if (res.from == "button") {
      console.log('分享后的返回值res', res)
      let bookId = res.target.dataset.item.id
      return {
        title: '美丽花亲子时光',
        path: '/pages/newLibrary/selectedBookInfo/selectedBookInfo?id=' + bookId + '&u_id=' + this.data.mine,
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
  // 获取单本书页面信息
  getBookDetailInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Shop/product_details`,
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.id
    }
    app.wxRequest(url, data, (res) => {
      console.log('单本书', res)
      if (res.data.code == 1) {
        res.data.data.litpic1 = app.ossImgUrl + res.data.data.litpic
        self.setData({
          'goodsCont': res.data.data,
          'mine': res.data.data.mine
        })
      }
      let article = res.data.data.content;
      WxParse.wxParse('article', 'html', article, self, 5);

      self.friendCircleCode()
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
        that.getBookDetailInfo()
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  btn_send () {
    var that = this;
    var dataInformation = that.data.goodsCont;
    var dataPro = [];
    var dataObj = {};
    dataObj['name'] = dataInformation.name;
    dataObj['id'] = dataInformation.id;
    dataObj['litpic'] = dataInformation.litpic;
    dataObj['money'] = dataInformation.money;
    dataObj['moneys'] = dataInformation.moneys;
    dataObj['integral'] = dataInformation.integral;
    dataObj['num'] = 1;
    dataObj['u_id'] = that.data.u_id ? that.data.u_id : ''
    dataPro.push(dataObj);
    console.log(dataPro, 111131313123131313)
    wx.navigateTo({
      url: '/pages/send/send?typeNum=3&dataPro=' + JSON.stringify(dataPro) + '&money=' + dataInformation.moneys + '&libId=' + this.data.libId + '&bookId=' + this.data.id,
    })
  },
  btn_car: function () {
    var that = this;
    // wx.navigateTo({
    //   url: '/pages/shopCar/shopCar',
    // })
    app.redirectWx(that, '/pages/shopCar/shopCar', '', true, '/pages/shopCar/shopCar');
  },
  // 是否确认加入购物车
  cancel: function () {
    var that = this;
    console.log("cancel")
    that.setData({
      isShadow: true,
      hidden: true
    })
  },
  add_car () {
    this.setData({
      hidden: false
    })
  },
  confirm: function () {
    console.log("confirm")
    var that = this;
    var goodsPro = app.globalData.goodsPro;
    var goodsNum = app.globalData.goodsNum;
    var dataInformation = that.data.goodsCont;
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
      isShadow: true,
      hidden: true
    })
  },


  //显示对话框
  showModal: function () {
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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  // 朋友圈二维码
  friendCircleCode() {
    console.log('u_id', this.data.mine)
    let self = this,
      url = `${app.baseUrl}/interface/UserInfo/get_code_picture`,
      data = {}
    data = {
      'id': self.data.id,   // 书本id
      'type': 9,
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
      setTimeout(function () {
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