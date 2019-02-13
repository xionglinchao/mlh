const app = getApp()

Page({
  data: {
    
  },
  onLoad: function (options) {
    this.setData({
      'id': options.id || null
    })
    var scene = decodeURIComponent(options.id)
    console.log('scene', scene)
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.toQrCodePage()
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
  // 获取页面信息
  toQrCodePage() {
    let self = this, url = `${app.baseUrl}/interface/Home_page/homePage`, data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.id
    }
    app.wxRequest(url, data, (res) => {
      console.log('二维码',res)
      if(res.data.code == 1) {
        res.data.data.qr_code = app.ossImgUrl + res.data.data.qr_code
        this.setData({
          'QrCode': res.data.data
        })
      }
    })
  },
  // 图片预览
  previewImage(e) {
    console.log(e)
    let imgArr = []
    let itemUrl = e.currentTarget.dataset.src
    imgArr.push(itemUrl)
    wx.previewImage({
      current: app.ossImgUrl + itemUrl, // 当前显示图片的http链接
      urls: imgArr, // 需要预览的图片http链接列表
    })
  },
})