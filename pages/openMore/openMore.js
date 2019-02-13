// pages/openMore/openMore.js
var app = getApp();
const getTime = require('../../utils/getTime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openPro:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      var that = this;

      that.getGroupBuyData(options.id);
      
  },
  onShow: function () {
  },
  getGroupBuyData: function (id) {
    var that = this;

    wx.request({
      url: url.getGroupByInformation,
      data: {
        id: id
      },
      success: function (res) {
        if (res.data.code == 1) {
          var openPro = res.data.data.group;
          var numTime = res.data.data.shop.price_time;
          
          if (openPro.length > 0){
           
            for (var i = 0; i < openPro.length; i++){
              openPro[i]['remainingTime'] = getTime.getTime(openPro[i].time, numTime);
              
            }
          }


          that.setData({

            openPro: openPro,
            id: id
          })
        }
      }
    })
  },
  btn_send:function(e){
      console.log(e);
  }
})