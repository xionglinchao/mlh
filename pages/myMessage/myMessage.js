// pages/myMessage/myMessage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    followPersonalPro: [],
    followPersonalData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.getFollowPersonData();
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
  getFollowPersonData: function () {
    var that = this;

    var requestData = {
      openid: app.globalData.openId,
    }
    app.requestPost(that, app.globalData.urlApi.newsMyMessage, requestData, function (res) {

      if (res.data.code == 1) {

        var item = res.data.data.news;

        if (item.length == 0) {
          item = null;
        }

        that.setData({
          followPersonalPro: item,
          followPersonalData: res.data.data
        })
      } else {
        that.setData({
          followPersonalPro: null
        })
      }
    })
  },
  btn_leave_comment:function(e){
    var item = e.currentTarget.dataset.item;

      wx.showLoading({
        title: '加载中',
      })

      this.getVolunteerType(item.id, item.notice_id);
  },
  btn_tab_message:function(e){
    var info = e.currentTarget.dataset.info;
    var parameterStrng = '';
    if(info == 1){
      app.navigateWx(this, '../volunteerReviewNews/volunteerReviewNews');
    }else if(info == 2){
      app.navigateWx(this, '../systemMessage/systemMessage');
    }else if(info == 3){
      app.navigateWx(this, '../interactiveMessage/interactiveMessage');
    }
  },

  getVolunteerType: function (id, notice_id) {
    var that = this;

    var requestData = {
      openid: app.globalData.openId,
      id: id,
      type: 4
    }
    app.requestPost(that, app.globalData.urlApi.changeMessageType, requestData, function (res) {


      var parameterStrng = '?id=' + notice_id;
      app.navigateWx(this, '../leaveComments/leaveComments', parameterStrng);

      wx.hideLoading();
    })
  }
  
})