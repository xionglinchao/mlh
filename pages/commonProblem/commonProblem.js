// pages/commonProblem/commonProblem.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    problemPro: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getData: function () {
    var that = this;

    wx.request({
      url: app.globalData.urlApi.commonProblem,
      data: {},
      success: function (res) {
        console.log(res);

        if (res.data.code == 1) {
          that.setData({
            problemPro: res.data.data
          })
        }
      }
    })
  },
  btn_infor: function (e) {
    console.log(e);
    var that = this;

    wx.navigateTo({
      url: '../problemInformation/problemInformation?id=' + e.currentTarget.dataset.item.id,
    })
  }
})