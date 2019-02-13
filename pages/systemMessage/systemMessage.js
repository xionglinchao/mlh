var app = getApp();
Page({
  data: {
    systemPro: []
  },
  onLoad: function (options) {
    this.getVolunteerType();
  },
  onShow: function () {
  
  },
  getVolunteerData: function () {
    var that = this;

    var requestData = {
      openid: app.globalData.openId,
    }
    app.requestPost(that, app.globalData.urlApi.systemMessage, requestData, function (res) {

      if (res.data.code == 1) {

        var item = res.data.data;

        if (item.length == 0) {
          item = null;
        }

        that.setData({
          systemPro: item
        })
      } else {
        that.setData({
          systemPro: null
        })
      }
    })
  },
  getVolunteerType: function () {
    var that = this;

    var requestData = {
      openid: app.globalData.openId,
      id: 0,
      type: 1
    }
    app.requestPost(that, app.globalData.urlApi.changeMessageType, requestData, function (res) {

      that.getVolunteerData();
    })
  }
})