// pages/badgeShow/badgeShow.js
var app = getApp();
Page({
  data: {
    sw: 0,
    typeNum: 1,
    badgeNum1: '',
    badgeNum10: '',
    num1: 0,
    num2: 0,
    typeNum1: 0,
    badgeNum: 0
  },
  onLoad: function (options) {
    var that = this;
      console.log(options);
    var badgeNum = options.badgeNum;
    if (options.typeNum1){
      that.setData({
        typeNum1: 1
      })
    }
    if(badgeNum.length > 1){
      var num1 = badgeNum.substr(0,1);
      var num2 = badgeNum.substr(1,2);
      that.setData({
        badgeNum1: app.globalData.urlApi.ossImageUrl + "meilihua/upload/lv" + num2 + ".png",
        badgeNum10: app.globalData.urlApi.ossImageUrl + "meilihua/upload/lv" + num1 + ".png",
        num1: num2,
        num2: num1,
      })
    }else{
      that.setData({
        badgeNum10: 0,
        badgeNum1: app.globalData.urlApi.ossImageUrl + "meilihua/upload/lv" + badgeNum + ".png",
        num1: badgeNum,
        num2: 0,
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sw: res.windowWidth,
          typeNum: options.typeNum,
          badgeNum: options.badgeNum
        })
      },
    })
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '我获得一枚徽章，来看看吧',
      path: '/pages/badgeShow/badgeShow?typeNum1=1&typeNum=' + that.data.typeNum + '&badgeNum=' + that.data.badgeNum,
      success: function (res) {
        // 转发成功
        console.log(res);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  btn_go_home:function(){
    app.switchTabWx(this, '../homepage/homepage')
  }
})