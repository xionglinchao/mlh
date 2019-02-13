// pages/openList/openList.js
var app = getApp();
const getTime = require('../../utils/getTime.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    informationType: 1,
    groupBuyPro: {},
    id: 0,
    openPro: [],
    num: 3,
    commentPro: [],
    image1w: 0,
    image1h: 0,
    sw: 0,
    commentPro1: [],
    isShowToast: true,
    toastData: '',
    isLoading: false,
    name: '',
    isLogin: 0,
    isViewDisabled: true
  },
  onLoad: function(options) {
    console.log(options);
    var that = this;
    that.setData({
      id: options.id
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sw: res.windowWidth,
          name: options.name
        })
      },
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
    that.getGroupBuyData(options.id);
    that.getCommentData(options.id);
    that.get_is_login(that);
  },
  onShow: function() {
    var that = this;
    if (that.data.id != 0) {
      that.getGroupBuyData(that.data.id);
      that.getCommentData(that.data.id);
      that.get_is_login(that);
    }
    that.setData({
      isViewDisabled: true
    })
  },
  onShareAppMessage: function() {
    var that = this;
    return {
      title: that.data.name,
      path: '/pages/openList/openList?id=' + that.data.id + '&typeNum=2&name' + that.data.name,
      success: function(res) {
        // 转发成功
        console.log(res);
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  btn_type: function(e) {
    var that = this;
    that.setData({
      informationType: e.currentTarget.dataset.info
    })
  },
  getGroupBuyData: function(id) {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getGroupByInformation,
      data: {
        id: id
      },
      success: function(res) {
        if (res.data.code == 1) {
          var openPro = res.data.data.group;
          var numTime = res.data.data.shop.price_time;
          if (openPro.length > 0) {
            for (var i = 0; i < openPro.length; i++) {
              openPro[i]['remainingTime'] = getTime.getTime(openPro[i].time, numTime);
            }
          }
          that.setData({
            openPro: openPro,
            groupBuyPro: res.data.data,
            id: id,
            isLoading: true
          })
          var article = res.data.data.shop.content;
          WxParse.wxParse('article', 'html', article, that, 5);
        } else {
          that.setData({
            isLoading: false
          })
        }
      }
    })
  },
  btn_open_more: function() {
    var that = this;
    var id = that.data.id;
    var isLogin = that.data.isLogin;
    that.setData({
      isViewDisabled: false
    })
    if (isLogin == 1) {
      wx.navigateTo({
        url: '../openMore/openMore?id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '../forceLogin/forceLogin',
      })
    }
  },
  btn_send: function(e) {
    var that = this;
    var shop = that.data.groupBuyPro.shop;
    var item = e.currentTarget.dataset.item;
    var dataInformation = that.data.groupBuyPro.shop;
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
      dataObj['moneys'] = dataInformation.price;
      dataObj['kt_id'] = item.id;
      dataObj['people'] = dataInformation.price_people;
      dataObj['delegation_id'] = item.delegation_id
      dataObj['num'] = 1;
      dataPro.push(dataObj);
      wx.navigateTo({
        url: '../send/send?typeNum=4&dataPro=' + JSON.stringify(dataPro),
      })
    } else {
      wx.navigateTo({
        url: '../forceLogin/forceLogin',
      })
    }
  },
  // 一键开团
  btn_k_t: function() {
    var that = this;
    var shop = that.data.groupBuyPro.shop;
    var dataInformation = that.data.groupBuyPro.shop;
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
      dataObj['moneys'] = dataInformation.price;
      dataObj['people'] = dataInformation.price_people;
      dataObj['num'] = 1;
      dataPro.push(dataObj);
      wx.navigateTo({
        url: '../send/send?typeNum=5&dataPro=' + JSON.stringify(dataPro),
      })
    } else {
      wx.navigateTo({
        url: '../forceLogin/forceLogin',
      })
    }
  },
  // 单独购买
  btn_go_buy: function() {
    var that = this;
    var shop = that.data.groupBuyPro.shop;
    var dataInformation = that.data.groupBuyPro.shop;
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
        url: '../send/send?typeNum=6&dataPro=' + JSON.stringify(dataPro),
      })
    } else {
      wx.navigateTo({
        url: '../forceLogin/forceLogin',
      })
    }
  },
  getCommentData: function(id) {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getComments,
      data: {
        type: 0,
        com_id: id,
      },
      success: function(res) {
        var commentPro1 = that.data.commentPro1;
        if (res.data.code == 1) {
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
  btn_h_f: function(e) {
    var that = this;
    var com_id = that.data.id;
    var others = e.currentTarget.dataset.item.id;
    var isLogin = that.data.isLogin;
    that.setData({
      isViewDisabled: false
    })
    if (isLogin == 1) {
      wx.navigateTo({
        url: '../commment/commment?typeNum=' + 4 + '&id=' + com_id + '&others=' + others,
      })
    } else {
      wx.navigateTo({
        url: '../forceLogin/forceLogin',
      })
    }
  },
  imageload: function(e) {
    var that = this;
    var commentPro = that.data.commentPro;
    var index = e.target.dataset.index;
    wx.getSystemInfo({
      success: function(res) {
        var image1w = 0;
        var image1h = 0;
        var sw = res.windowWidth;
        image1w = e.detail.width
        if (image1w > sw) {
          image1w = sw;
        }
        console.log(res);
        image1h = e.detail.height;
        commentPro[index]['image1w'] = image1w;
        that.setData({
          commentPro: commentPro,
          commentPro1: commentPro
        })
      },
    })
  },
  btn_preview: function(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var image = e.currentTarget.dataset.image;
    for (var i = 0; i < item.litpic.length; i++) {
      item.litpic[i] = app.globalData.urlApi.ossImageUrl + item.litpic[i]
    }
    console.log(item);
    wx.previewImage({
      current: image,
      urls: item.litpic,
    })
  },
  btn_d_z: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.item.id;
    var ids = that.data.id;
    var isLogin = that.data.isLogin;
    if (isLogin == 1) {
      wx.request({
        url: app.globalData.urlApi.getActivityLike,
        data: {
          openid: app.globalData.openId,
          id: id
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              isShowToast: false,
              toastData: '点赞成功',
            })
            setTimeout(function() {
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
            setTimeout(function() {
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
  get_is_login: function(that) {
    wx.request({
      url: app.globalData.urlApi.getExist,
      data: {
        openid: app.globalData.openId
      },
      success: function(res) {
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