// pages/readyClubInfo/readyClubInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
   
      that.setData({
        id: options.id
      })
  },
  onShow: function () {
  
  },
  btn_basic:function(){
    var that = this;
    
    wx.navigateTo({
      url: '../readyClubBasic/readyClubBasic?id=' + that.data.id,
    })
  },
  btn_consignee:function(){
    var that = this;

    wx.navigateTo({
      url: '../readyClubConsigneeInfo/readyClubConsigneeInfo?id=' + that.data.id,
    })
  },
  btn_attorn:function(){
    var that = this;


    wx.navigateTo({
      url: '../readyClubAttorn/readyClubAttorn?id=' + that.data.id,
    })
  }
})