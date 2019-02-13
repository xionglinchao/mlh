// pages/attentionPerson/attentionPerson.js
var app = getApp();
let nowTime = require('../../utils/nowTime.js');
Page({
  data: {
    attentionPro: []
  },
  onLoad: function (options) {
    var that = this;
    that.getFollowData();
  },
  onShow: function () {
  
  },
  getFollowData: function () {//获取推荐人数据
    var that = this;
    var requestData = {
      openid: app.globalData.openId
    }
    app.requestPost(that, app.globalData.urlApi.getAttentionPerson, requestData, function (res) {
      if (res.data.code == 1) {
        that.setData({
          attentionPro: res.data.data,
        })
      }
    })
  },
  btn_attention: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var requestData = {
      openid: app.globalData.openId,
      type: 5,
      id: item.user.id
    }
    app.requestPost(that, app.globalData.urlApi.addFavorites, requestData, function (res) {
      if (res.data.code == 1) {
        wx.showToast({
          title: '关注成功',
          icon: 'none',
          duration: 2000
        })
        that.getFollowData();
      }
    })
  },
  btn_person_information: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var parameterStrng = '?id=' + item.user.id;
    app.redirectWx(that, '../personalInformation/personalInformation', parameterStrng);
  }
})