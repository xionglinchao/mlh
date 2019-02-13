// pages/choiceInformation/choiceInformation.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
let nowTime = require('../../utils/nowTime.js');
Page({
  data: {
    item: {},
    id: 0,
    sw: 0,
    title: ''
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      id: options.id
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sw: res.windowWidth
        })
      },
    })
  },
  onShow: function() {
    var that = this;
    if (app.globalData.openId) {
      that.getCreateFindData(that.data.id);
    } else {
      app.openIdReadyCallback = res => {
        app.globalData.openId = res;
        that.getCreateFindData(that.data.id);
      }
    }
  },
  onShareAppMessage: function() {
    var that = this;
    var id = that.data.id;
    var title = that.data.title;
    return {
      title: title,
      path: '/pages/choiceInformation/choiceInformation?id=' + id,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  getCreateFindData: function(id) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var requestData = {
      openid: app.globalData.openId,
      id: id
    }
    app.requestPost(that, app.globalData.urlApi.getChioceComment, requestData, function(res) {
      if (res.data.code == 1) {
        var item = res.data.data;
        item['times'] = nowTime.timeNum(item.time);
        for (var i = 0; i < item.comment.length; i++) {
          item.comment[i]['times'] = nowTime.timeNum(item.comment[i].time);
        }
        wx.setNavigationBarTitle({
          title: item.name,
        })
        that.setData({
          item: item,
          title: item.name
        })
        var article = res.data.data.content;
        WxParse.wxParse('article', 'html', article, that, 5);
      }
      wx.hideLoading();
    })
  },
  btn_write_comment: function() {
    var that = this;
    var item = that.data.item;
    var parameterStrng = '?id=' + item.id + '&typeNum=' + item.platform_list + '&typeInfo=0';
    app.navigateWx(that, '../choiceRecruitComment/choiceRecruitComment', parameterStrng);
  },
  btn_go_comment: function(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var platform_list = e.currentTarget.dataset.platform_list;
    var id = e.currentTarget.dataset.id
    var parameterStrng = '?id=' + id + '&typeNum=1&typeInfo=' + item.id;
    app.navigateWx(that, '../choiceRecruitComment/choiceRecruitComment', parameterStrng);
  },
  btn_choice_comment: function(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var parameterStrng = '?id=' + item.id;
    app.navigateWx(that, '../choiceRecruitTwoComment/choiceRecruitTwoComment', parameterStrng);
  },
  btn_go_likes: function(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var likes = 0;
    if (item.whether_like == 1) {
      likes = -1;
    } else {
      likes = 1
    }
    var requestData = {
      id: item.id,
      openid: app.globalData.openId,
      type: likes
    }
    app.requestPost(that, app.globalData.urlApi.setChioceLikes, requestData, function(res) {
      if (res.data.code == 1) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        that.getCreateFindData(that.data.id);
      }
    })
  },
  btn_preview: function(e) {
    if (!app.globalData.isNetwork) {
      wx.showModal({
        title: '提示',
        content: '当前网络状态不佳，请检查您的网络',
        showCancel: false,
        confirmText: '我知道了',
        success: function(res) {}
      })
      return;
    }
    console.log(e);
    var that = this;
    var item = e.currentTarget.dataset.item;
    var image = e.currentTarget.dataset.image;
    for (var i = 0; i < item.length; i++) {
      item[i] = app.globalData.urlApi.ossImageUrl + item[i]
    }
    console.log(item);
    wx.previewImage({
      current: image,
      urls: item,
    })
  },
})