const app = getApp()

Page({
  data: {

  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },

  // confirmBtnClick() {
  //   wx.navigateTo({
  //     url: '/package_find/pages/gongdujiPublish/distributionCourse/distributionCourse',
  //   })
  // },
  preview_img() {
    wx.previewImage({
      current: 'https://meilihua.oss-cn-hangzhou.aliyuncs.com/program/images/ambassador.jpg', // 当前显示图片的http链接
      urls: ['https://meilihua.oss-cn-hangzhou.aliyuncs.com/program/images/ambassador.jpg'] // 需要预览的图片http链接列表
    })
  },
})