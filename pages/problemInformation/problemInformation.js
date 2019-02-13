// pages/problemInformation/problemInformation.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  data: {

  },
  onLoad: function (options) {
    var that = this;

    that.getData(options.id);
  },
  getData:function(id){
      var that = this;

      wx.request({
        url: app.globalData.urlApi.problemInformation,
        data:{
          id: id
        },
        success:function(res){
          console.log(res);

          if(res.data.code == 1){

            var article = res.data.data.content;
            WxParse.wxParse('article', 'html', article, that, 5);
          }
        }
      })
  }
})