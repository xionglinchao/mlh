// pages/customService/customService.js
var app = getApp();
Page({
  data: {
    sw: 0,
    headImage:''
  },
  onLoad: function (options) {

      var that = this;
      wx.getSystemInfo({
        success: function(res) {

          that.setData({
            sw: res.windowWidth
          })
        },
      })

      that.getCustomerPhoto();
  },
  getCustomerPhoto:function(){
    var that  = this;

    wx.request({
      url: app.globalData.urlApi.getCustomerPhoto,
      data:{},
      success:function(res){
        console.log(res);
       
          that.setData({
            headImage: res.data.data
          })
        
      }
    })
  }
})