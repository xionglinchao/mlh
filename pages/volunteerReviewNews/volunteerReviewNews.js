// pages/volunteerReviewNews/volunteerReviewNews.js
var app = getApp();
Page({

  data: {
    volunteerPro: []
  },
  onLoad: function(options) {},
  onShow: function() {
    var that = this;
    that.getVolunteerData();
  },
  getVolunteerData: function() {
    var that = this;
    var requestData = {
      openid: app.globalData.openId,
    }
    app.requestPost(that, app.globalData.urlApi.volunteerMessage, requestData, function(res) {
      if (res.data.code == 1) {
        var item = res.data.data;
        if (item.length == 0) {
          item = null;
        }
        that.setData({
          volunteerPro: item
        })
      } else {
        that.setData({
          volunteerPro: null
        })
      }
    })
  },
  getVolunteerType: function(id) {
    var that = this;
    var requestData = {
      openid: app.globalData.openId,
      id: id,
      type: 5
    }
    app.requestPost(that, app.globalData.urlApi.changeMessageType, requestData, function(res) {
      app.navigateWx(this, '../volunteerManager/volunteerManager');
      wx.hideLoading();
    })
  },
  btn_go_volunteer: function(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    wx.showLoading({
      title: '加载中',
    })
    that.getVolunteerType(item.id);
  }
})