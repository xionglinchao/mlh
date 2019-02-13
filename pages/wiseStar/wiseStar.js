const app = getApp()
Page({
  data: {
    noticeList: [], // 顶部通知列表
    isRuleIntroHide: true,  // 规则介绍弹窗隐藏
    isSlideDownHide: false, // 向下滚动时，提示栏隐藏
    isLoadingMore: false, // 是否正在加载更多数据
    curPage: 1, // 当前加载数据的页数
    allPages: 0, // 数据总的页数
    baseInfo: null, // 顶部信息
    rankList: [], // 智慧榜单排名
    ruleContent: [], // 规则介绍弹窗内容
  },
  onLoad: function (options) {
    this.getUserRankInfo()
    this.getTopNotice()
    this.getStarRule()
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
  // 规则介绍点击事件
  ruleBtnClick() {
    this.setData({ 'isRuleIntroHide': !this.data.isRuleIntroHide })
  },
  // 规则介绍关闭事件
  showRulePopup() {
    this.setData({ 'isRuleIntroHide': !this.data.isRuleIntroHide })
  },
  // 滚动时，提示栏隐藏
  scrollHide: function (e) {
    this.setData({ 'isSlideDownHide': true })
  },
  // 获取顶部通知
  getTopNotice() {
    let self = this, url = app.baseUrl + '/Api/Read_station/prize_list', data = {}
    app.wxRequest(url, data, function (res) {
      console.log('顶部通知列表', res)
      if (res.data.code == 1) {
        self.setData({
          'noticeList': res.data.data
        })
      }
    })
  },
  // 获取用户排名信息
  getUserRankInfo(page = null) {
    let self = this, url = app.baseUrl + '/Api/Read_station/integral_rank', data = {}
    data = {
      'openid': app.globalData.openId,
      'p': page || this.data.curPage
    }
    wx.showLoading({
      title: '正在加载中',
    })
    app.wxRequest(url, data, (res) => { //箭头函数不会改变this所指的对象
      console.log('获取排名信息', res)
      if (res.data.code == 1) {
        if (page > 1) {
          var rankList = self.data.rankList
          rankList = rankList.concat(res.data.data.rank_lists)
        } else {
          var rankList = []
          rankList = res.data.data.rank_lists
        }
        this.setData({
          'baseInfo': res.data.data.base_info,
          'rankList': rankList,
          'allPages': res.data.data.all_pages,
          'isLoadingMore': false,
        })
      }
      wx.hideLoading()
    })
  },
  preventDeafult(e){
    return
  },
  // 加载更多
  loadMore() {
    if (this.data.isLoadingMore) return
    console.log(this.data.allPages)
    this.data.curPage++
    if (this.data.curPage <= this.data.allPages) {
      this.setData({
        'isLoadingMore': true,
        'curPage': this.data.curPage
      })
      this.getUserRankInfo(this.data.curPage)
    } else {
      wx.showToast({
        icon: 'none',
        title: '没有更多信息啦',
        duration: 1000
      })
    }
  },
  getStarRule() {
    let self = this, url = app.baseUrl + '/Api/Read_station/integral_rule', data = {}
    app.wxRequest(url, data, function (res) {
      console.log('智慧之星规则', res)
      if (res.data.code == 1) {
        self.setData({
          'ruleContent': res.data.data.lists
        })
      }
    })
  }
})