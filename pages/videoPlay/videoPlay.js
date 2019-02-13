// pages/videoPlay/videoPlay.js
Page({
  data: {
    videoUrl: 0,
    isShadow1: false
  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      videoUrl: options.videoPlay
    })
  },
  onShow: function () {

  },
  playEnd: function () {
    // wx.navigateBack({
    //   delta: 1
    // })
  }

})