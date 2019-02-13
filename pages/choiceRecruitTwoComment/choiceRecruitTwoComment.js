// pages/choiceRecruitTwoComment/choiceRecruitTwoComment.js
var app = getApp();
Page({
  data: {
    itemComment: {},
    id: 0,
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      id: options.id
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sw: res.windowWidth,
        })
      },
    })
  },
  onShow: function() {
    var that = this;
    that.getCreateFindCommentData(that.data.id);
  },
  getCreateFindCommentData: function(id) {
    var that = this;
    var requestData = {
      openid: app.globalData.openId,
      id: id
    }
    app.requestPost(that, app.globalData.urlApi.getTwoChoiceComment, requestData, function(res) {
      if (res.data.code == 1) {
        that.setData({
          itemComment: res.data.data,
        })
      }
    })
  },
  btn_write_comment: function() {
    var that = this;
    var item = that.data.itemComment;
    var id = that.data.id;
    var parameterStrng = '?id=' + id + '&typeNum=1&typeInfo=' + item.id;
    app.navigateWx(that, '../choiceRecruitComment/choiceRecruitComment', parameterStrng);
  },
  btn_go_likes: function() {
    var that = this;
    var item = that.data.itemComment;
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
        that.getCreateFindCommentData(that.data.id);
      }
    })
  },
  btn_preview: function(e) {
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