// pages/feedback/feedback.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: true,
    toastData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that  = this;
  },
  onShow: function () {
  
  },
  btn_submit:function(e){
    var that = this;
    var name = e.detail.value;

    wx.request({
      url: app.globalData.urlApi.feedBack,
      data:{
        openid: app.globalData.openId,
        content: name
      },
      success:function(res){
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
          })

          setTimeout(function () {
            that.setData({
              isShowToast: true,
            })
            if (res.data.code == 1) {
              wx.navigateBack({
                delta: 1
              })
            }
          }, 2000)
        
      }
    })

  }
})