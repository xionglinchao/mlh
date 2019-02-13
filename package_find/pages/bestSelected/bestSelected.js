const app = getApp()

Page({
  data: {

  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.getSelectedArticleInfo()
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
  // 获取精选文章列表页面信息
  getSelectedArticleInfo() {
    let self = this, url = `${app.baseUrl}/interface/Reading/article_lists`, data = {}
    app.wxRequest(url, data, (res) => {
      console.log('精选文章列表',res)
      if(res.data.code == 1) {
        for(let i = 0; i < res.data.data.length; ++i) {
          res.data.data[i].cover = app.ossImgUrl + res.data.data[i].cover
        }
        this.setData({
          'articleList': res.data.data
        })
      }
    })
  },
  // 文章详情跳转
  toSelectedArticleDetail(e) {
    console.log(e)
    let articleId = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/package_find/pages/selectedArticle/selectedArticle?articleId=' + articleId,
    })
  },
  // 底部按钮跳转
  toHomepageClick() {
    wx.reLaunch({
      url: '/pages/homepage/homepage',
    })
  },
  toPersonalPageClick(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage',
    })
  },
})