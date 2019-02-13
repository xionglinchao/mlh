// pages/library/library.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 0,
    libraryPro: [],
    isNewWork: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth
        })

      },
    })

    
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
    var that = this;

    that.getLibraryData();
    
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  showInput: function () {
    var that = this;

    var parameterStrng = '';

    app.navigateWx(that, '../searchLibrary/searchLibrary', parameterStrng);
  },
  getLibraryData: function () {
    var that = this;

    wx.showLoading({
      title: '加载中',
    })

    app.requestGet(that, app.globalData.urlApi.getLibrary, function (res) {

      if (res.data.code == 1) {

        that.setData({
          libraryPro: res.data.data,
          isNewWork: true,
          isViewDisabled: true
        })
      }
      wx.hideLoading();
    })
  },
  btn_two_classification_3: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.item.id

    var parameterStrng = '?id=' + id;

    app.navigateWx(that, '../threeClass/threeClass', parameterStrng);

  },
  btn_refurbish:function(){
    var that = this;

    that.getLibraryData();
  }

})