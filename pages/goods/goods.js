var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    sw: 0,
    goodsPro:{},
    informationType: 1,
    id: 0,
    isShadow: true,
    hidden: true,
    goodsNum: 0,
    isShowToast: true,
    toastData: '',
    commentPro: [],
    commentPro1: [],
    isLoading: false,
    name: '',
    isLogin: 0,
    isViewDisabled: true
  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      id: options.id,
      libId: options.libId || ''
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sw: res.windowWidth,
          goodsNum: app.globalData.goodsNum,
          name: options.name
        })
      },
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
  },
  onShow: function () {
    var that = this;
      that.getGoodsData(that.data.id);
      that.getCommentData(that.data.id);
      that.get_is_login(that);
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.name,
      path: '/pages/goods/goods?id=' + that.data.id + '&typeNum=2&name' + that.data.name,
    }
  },
  getGoodsData:function(id){
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getGoods,
      data:{
        id: id,
        openid: app.globalData.openId
      },
      success:function(res){
        console.log(res);

        if(res.data.code == 1){

          that.setData({
            goodsPro: res.data.data,
            isLoading: true
          })
          var article = res.data.data.content;
          WxParse.wxParse('article', 'html', article, that, 5);
        }else{
          that.setData({
            isLoading: true
          })
        }
      }
    })
  },
  btn_s_c:function(){
    var that = this;
    var id = that.data.id;
    var goodsPro = that.data.goodsPro;
    var isLogin = that.data.isLogin;
    if(isLogin == 1){
      if (goodsPro.collection == 0) {
        wx.request({
          url: app.globalData.urlApi.addFavorites,
          data: {
            openid: app.globalData.openId,
            type: 0,
            id: id
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 1) {
              that.setData({
                isShowToast: false,
                toastData: res.data.msg,
              })
              setTimeout(function () {
                that.setData({
                  isShowToast: true,
                })
                that.getGoodsData(id);
              }, 2000)
            } else {
              that.setData({
                isShowToast: false,
                toastData: res.data.msg,
              })
              setTimeout(function () {
                that.setData({
                  isShowToast: true,
                })
              }, 2000)
            }
          }
        })
      } else {
        that.setData({
          isShowToast: false,
          toastData: '已收藏',
        })
        setTimeout(function () {
          that.setData({
            isShowToast: true,
          })
        }, 2000)
      }
    }else{
      that.setData({
        isViewDisabled: false
      })
      wx.navigateTo({
        url: '../forceLogin/forceLogin',
      })
    }
  },
  btn_send:function(){
    var that = this;
    var dataInformation = that.data.goodsPro;
    var dataPro = [];
    var dataObj = {};
    var isLogin = that.data.isLogin;
    that.setData({
      isViewDisabled: false
    })
    if (isLogin == 1) {
      dataObj['name'] = dataInformation.name;
      dataObj['id'] = dataInformation.id;
      dataObj['litpic'] = dataInformation.litpic;
      dataObj['money'] = dataInformation.money;
      dataObj['moneys'] = dataInformation.moneys;
      dataObj['integral'] = dataInformation.integral;
      dataObj['num'] = 1;
      dataPro.push(dataObj);
      wx.navigateTo({
        url: '../send/send?typeNum=3&dataPro=' + JSON.stringify(dataPro) + '&money=' + dataInformation.moneys + '&libId=' + this.data.libId,
      })
    } else {
      wx.navigateTo({
        url: '../forceLogin/forceLogin',
      })
    }
  },
  add_shop_car:function(){
    var that = this;
    var isLogin = that.data.isLogin;
    if (isLogin == 1) {
      that.setData({
        isShadow: false,
        hidden: false
      })
    } else {
      that.setData({
        isViewDisabled: false
      })
      wx.navigateTo({
        url: '../forceLogin/forceLogin',
      })
    }
  },
  cancel:function(){
    var that = this;
    that.setData({
      isShadow: true,
      hidden: true
    })
  },
  confirm:function(){
    var that = this;
    var goodsPro = app.globalData.goodsPro;
    var goodsNum = app.globalData.goodsNum;
    var dataInformation = that.data.goodsPro;
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
    for (var i = 0; i < goodsPro.length; i++){
      if (goodsPro[i].id == dataInformation.id){
        goodsPro[i].num += 1;
      }
    }
    if (goodsPro['id' + dataInformation.id]){
      goodsPro['id' + dataInformation.id]['num'] += 1;
    }else{
      goodsPro['id' + dataInformation.id] = dataObj;
    }
    console.log(goodsPro);
    app.globalData.goodsPro = JSON.parse(JSON.stringify(goodsPro));
    app.globalData.goodsNum = goodsNum;
    that.setData({
      goodsNum: goodsNum,
      isShadow: true,
      hidden: true
    })
  },
  btn_car:function(){
    var that = this;
    app.redirectWx(that, '../shopCar/shopCar', '', true, 'pages/shopCar/shopCar');
  },
  btn_type: function (e) {
    var that = this;
    if (e.currentTarget.dataset.info == 1) {
      that.setData({
        informationType: e.currentTarget.dataset.info,
      })
    } else {
      that.setData({
        informationType: e.currentTarget.dataset.info,
      })
    }
  },
  getCommentData: function (id) {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getComments,
      data: {
        type: 0,
        com_id: id,
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          var commentPro1 = that.data.commentPro1;
          var dataPro = res.data.data;
          for (var i = 0; i < res.data.data.length; i++) {
            dataPro[i]['isFalse'] = true;
          }
          if (commentPro1.length > 0) {
            for (var i = 0; i < commentPro1.length; i++) {
              for (var j = 0; j < dataPro.length; j++) {
                if (!commentPro1[i].image1w) {
                  break;
                }
                if (commentPro1[i].id == dataPro[j].id) {
                  if (commentPro1[i].image1w) {
                    dataPro[j]['image1w'] = commentPro1[i].image1w;
                  }
                }
              }
            }
          }
          that.setData({
            commentPro: res.data.data
          })
        }
      }
    })
  },
  imageload: function (e) {
    var that = this;
    var commentPro = that.data.commentPro;
    var index = e.target.dataset.index;
    wx.getSystemInfo({
      success: function (res) {
        var image1w = 0;
        var image1h = 0;
        var sw = res.windowWidth;
        image1w = e.detail.width
        if (image1w > sw) {
          image1w = sw;
        }
        image1h = e.detail.height;
        commentPro[index]['image1w'] = image1w;
        that.setData({
          commentPro: commentPro,
          commentPro1: commentPro
        })
      },
    })
  },
  btn_preview: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var image = e.currentTarget.dataset.image;
    for (var i = 0; i < item.litpic.length; i++) {
      item.litpic[i] = app.globalData.urlApi.ossImageUrl + item.litpic[i]
    }
    wx.previewImage({
      current: image,
      urls: item.litpic,
    })
  },
  btn_d_z: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.item.id;
    var ids = that.data.id;
    var isLogin = that.data.isLogin;
    if (isLogin == 1) {
      wx.request({
        url: app.globalData.urlApi.getActivityLike,
        data: {
          openid: app.globalData.openId,
          id: id,
          type: 1
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 1) {
            that.setData({
              isShowToast: false,
              toastData: '点赞成功',
            })
            setTimeout(function () {
              that.setData({
                isShowToast: true,
              })
              that.getCommentData(ids);
            }, 2000)
          } else {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
            })
            setTimeout(function () {
              that.setData({
                isShowToast: true,
              })
            }, 2000)
          }
        }
      })
    } else {
      that.setData({
        isViewDisabled: false
      })
      wx.navigateTo({
        url: '../forceLogin/forceLogin',
      })
    }
  },
  btn_goods:function(e){
    var that = this;
    var item = e.currentTarget.dataset.item;
    var isLogin = that.data.isLogin;
    that.setData({
      isViewDisabled: false
    })
    if (isLogin == 1) {
      wx.redirectTo({
        url: '../goods/goods?id=' + item.id,
      })
    } else {
      wx.navigateTo({
        url: '../forceLogin/forceLogin',
      })
    }
    console.log(e);
  },
  get_is_login: function (that) {
    wx.request({
      url: app.globalData.urlApi.getExist,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            isLogin: 1
          })
        } else {
          that.setData({
            isLogin: -1
          })
        }
      }
    })
  }
})