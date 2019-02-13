// pages/meetingRankList/meetingRankList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    rankDataPro:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        var that = this;

        that.setData({
          id: options.id
        })

        that.getRankData(options.id);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getRankData:function(id){
    var that = this;

    wx.request({
      url: app.globalData.urlApi.getReadingDonate,
      data:{
        id: id
      },
      success:function(res){
        console.log(res);

        if(res.data.code == 1){

          that.setData({
            rankDataPro: res.data.data
          })
        }
      }
    })
  }
})