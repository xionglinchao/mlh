var app = getApp();
Page({
  data: {
    volunteerPro: []
  },
  onLoad: function (options) {
    var that = this;

    that.getVolunteerType();
  },
  onShow: function () {

  },
  getVolunteerData: function () {
    var that = this;

    var requestData = {
      openid: app.globalData.openId,
    }
    app.requestPost(that, app.globalData.urlApi.frenMessage, requestData, function (res) {

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
  getVolunteerType: function () {
    var that = this;

    var requestData = {
      openid: app.globalData.openId,
      id: 0,
      type: 2
    }
    app.requestPost(that, app.globalData.urlApi.changeMessageType, requestData, function (res) {

      that.getVolunteerData();
    })
  }
})