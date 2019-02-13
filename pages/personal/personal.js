// pages/personal/personal.js
var app = getApp();
Page({
  data: {
    sw: 0,
    pageType: 1,
    isLogin: 1,
    userInfo: {},
    openId: '',
    inforPro: {},
    carPro: [],
    shopMoney: 0,
    shopNum: 0,
    isCheck: false,
    carGoodsPro: [],
    signInNum: 1,
    square_color: 0,
    orderNum1: 0,
    orderNum2: 0,
    orderNum3: 0,
    orderNum4: 0,
    isLoading: false,
    personalMessage: 0,
    goodsNum: 0
  },
  onLoad: function (options) {
    let vision = wx.getStorageSync('vision')
    this.setData({
      'vision': vision
    })
  },
  onShow: function () {
    var that = this;
    // console.log(app.globalData.userInfo)
    that.setData({
      userInfo: app.globalData.userInfo,
      goodsNum: app.globalData.goodsNum
    })
    if (app.globalData.openId) {
      that.get_is_login(that);
      that.getSignInData();
      that.getOrderNum();
      that.getUserInformation();
      that.getMessageData();
      that.getMessageNoticeData();
    } else {
      app.openIdReadyCallback = res => {
        that.get_is_login(that);
        that.getSignInData();
        that.getOrderNum();
        that.getUserInformation();
        that.getMessageData();
        that.getMessageNoticeData();
      }
    }
  },
  btn_order: function (e) {//订单页
    if (e.currentTarget.dataset.info == 5) {
      app.navigateWx(this, '../refund/refund');
    } else {
      if (this.data.isLogin == 1) {
        var parameterStrng = '?order=' + e.currentTarget.dataset.info;
        app.navigateWx(this, '../order/order', parameterStrng);
      } else {
        app.navigateWx(this, '../forceLogin/forceLogin');
      }
    }
  },
  btn_myRelayRead: function () {//我的接力读
    if (this.data.isLogin == 1) {
      app.navigateWx(this, '../relayReadClassify/myRelayRead/myRelayRead');
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  btn_myActivity: function () {//我的活动
    if (this.data.isLogin == 1) {
      app.navigateWx(this, '../myActivity/myActivity');
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  btn_pay: function () {//公益币兑换
    if (this.data.isLogin == 1) {
      app.navigateWx(this, '../pay/pay');
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  btn_kf: function () {//客服中心
    app.navigateWx(this, '../customService/customService');
  },
  btn_log_together: function () {//共读日志
    if (this.data.isLogin == 1) {
      app.navigateWx(this, '../logTogether/logTogether');
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  btn_address: function () {
    if (this.data.isLogin == 1) {
      var parameterStrng = '?info=1';
      app.navigateWx(this, '../address/address', parameterStrng);
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  btn_manager: function () {//义工管理
    if (this.data.isLogin == 1) {
      app.navigateWx(this, '../volunteerManager/volunteerManager');
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  btn_login: function (e) {//修改用户信息界面
    if (e.currentTarget.dataset.info == 1) {
      app.navigateWx(this, '../account/account');
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  btn_coupon: function () {//优惠券
    if (this.data.isLogin == 1) {
      var parameterStrng = '?typeNum=1';
      app.navigateWx(this, '../coupon/coupon', parameterStrng);
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  btn_reading_party: function () {//我的阅读会
    if (this.data.isLogin == 1) {
      if (this.data.square_color == 3) {
        app.navigateWx(this, '../readingParty/readingParty');
      } else {
        app.navigateWx(this, '../myReadyClub/myReadyClub');
      }
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  // 获取用户信息
  getUserInformation: function () {
    if (app.globalData.openId) {
      var that = this;
      wx.request({
        url: app.globalData.urlApi.getUserInfomation,
        data: {
          openid: app.globalData.openId
        },
        success: function (res) {
          console.log('用户信息', res);
          if (res.data.code == 1) {
            var inforPro = res.data.data;
            inforPro['phone'] = inforPro.phone.replace(/(.{3}).*(.{4})/, "$1****$2");
            if (inforPro.litpic.indexOf('http') == -1) {
              inforPro.litpic = app.globalData.urlApi.ossImageUrl + inforPro.litpic;
            }
            app.globalData.square_color = inforPro.square_color;
            that.setData({
              inforPro: inforPro,
              square_color: inforPro.square_color
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/forceLogin/forceLogin',
      })
    }
  },
  btn_q_d: function () {//共读日志
    if (this.data.isLogin == 1) {
      app.navigateWx(this, '../logTogether/logTogether');
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  btn_collection: function () {//我的收藏
    if (this.data.isLogin == 1) {
      app.navigateWx(this, '../collection/collection');
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  btn_about_us: function () {//关于我们
    app.navigateWx(this, '../aboutUs/aboutUs');
  },
  getSignInData: function () {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getSignIn,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            signInNum: 0
          })
        } else if (res.data.code == -1) {
          that.setData({
            signInNum: 1,
          })
        }
      }
    })
  },
  btn_give: function () {//用户捐赠
    if (this.data.isLogin == 1) {
      app.navigateWx(this, '../donateBook/donateBook');
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  btn_f_k: function () {//用户反馈
    if (this.data.isLogin == 1) {
      app.navigateWx(this, '../feedback/feedback');
    } else {
      app.navigateWx(this, '../forceLogin/forceLogin');
    }
  },
  btn_common_problem: function () {//常见问题
    app.navigateWx(this, '../commonProblem/commonProblem');
  },
  btn_r_f: function () {//邀请好友
    app.navigateWx(this, '../requestFellow/requestFellow');
  },
  getOrderNum: function () {//获取各个状态下订单的个数
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getOrderNum,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {

          that.setData({
            orderNum1: res.data.data.a1,
            orderNum2: res.data.data.a2,
            orderNum3: res.data.data.a3,
          })
        }
      }
    })
  },
  //判断是否登录
  get_is_login: function (that) {
    wx.request({
      url: app.globalData.urlApi.getExist,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        var isLogin = 1;
        if (res.data.code == 1) {
          isLogin = 1;
        } else {
          isLogin = -1;
        }
        that.setData({
          isLogin: isLogin,
          isLoading: true
        })
      }
    })

  },
  btn_my_follow: function () {
    app.navigateWx(this, '../myFollowPersonal/myFollowPersonal');
  },
  btn_myMessage: function () {
    app.navigateWx(this, '../myMessage/myMessage');
  },
  getMessageData: function () {
    var that = this;
    var requestData = {
      openid: app.globalData.openId,
    }
    app.requestPost(that, app.globalData.urlApi.personalMessage, requestData, function (res) {
      if (res.data.code == 1) {
        that.setData({
          personalMessage: res.data.data
        })
      }
    })
  },
  getMessageNoticeData: function () {
    var that = this;
    // var requestData = {
    //   openid: app.globalData.openId,
    // }
    app.requestGet(that, app.globalData.urlApi.systemNotice, function (res) {

    })
  },
  btn_go_my_comment: function () {
    var that = this;
    var inforPro = that.data.inforPro;
    var parameterStrng = '?typeNum=2&id=' + inforPro.id;
    app.navigateWx(that, '../personalInformation/personalInformation', parameterStrng);
  },
  btn_myShopCar: function () {
    var that = this;
    app.navigateWx(that, '../shopCar/shopCar');
  },
  btn_badge: function (e) {
    var that = this;
    var info = e.currentTarget.dataset.info;
    var badgeNum = e.currentTarget.dataset.badgenum;
    if (badgeNum == 0) {
      return;
    }
    console.log(e);
    var parameterStrng = '?typeNum=' + info + '&badgeNum=' + badgeNum;
    app.navigateWx(that, '../badgeShow/badgeShow', parameterStrng);
  },

  // 个人主页跳转
  toPersonalPage() {
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage',
    })
  },
  // 修改个人资料
  toSettingPage() {
    wx.navigateTo({
      url: '/pages/account/account',
    })
  },
  // 利润余额页面跳转
  toProfitPage(e) {
    // console.log('利润余额', e)
    let username = e.currentTarget.dataset.item.username
    let partnerId = e.currentTarget.dataset.item.course_id
    if (partnerId == 3) {
      wx.navigateTo({
        url: '/pages/personal/partnerProfit/partnerProfit',
      })
    } else {
      wx.navigateTo({
        url: '/pages/personal/balanceProfit/balanceProfit?username=' + username,
      })
    }
  }

})