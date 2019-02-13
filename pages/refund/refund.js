// pages/refund/refund.js
var app = getApp();
Page({
  data: {
    datapro: [],
    isLoading: true,
    isViewDisabled: true
  },
  onLoad: function (options) {
      var that = this;

      that.getOrderData();
      
      wx.setNavigationBarTitle({
        title: '退款',
      })
  },
  onShow: function () {

    this.setData({
      isViewDisabled: true
    })
  },
  getOrderData: function () {
    var that = this;

    wx.request({
      url: app.globalData.urlApi.getOrder,
      data: {
        openid: app.globalData.openId,
        type: 5,
      },
      success: function (res) {

        if (res.data.code == 1) {
          console.log(res.data.data[0].shop);
          that.setData({
            datapro: res.data.data,
            isLoading: true
          })
        } else {
          that.setData({
            datapro: [],
            isLoading: true
          })
        }
      }
    })
  },
  btn_send: function (e) {
    this.setData({
      isViewDisabled: false
    })
    wx.navigateTo({
      url: '../orderInformation/orderInformation?info=' + e.currentTarget.dataset.item.orderId + '&typeNum=2',
    })
  },
})