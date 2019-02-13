import data from 'filterData'
const app = getApp()

Page({
  data: {
    inputVal:'',
  },
  onLoad: function(options) {
    const o = Object.assign(this.data, data)
    this.setData(o)
    console.log(this.data)
  },
  onReady: function() {

  },
  onShow: function() {
    this.getReadingMallInfo()
    this.getFilterDataInfo()
    this.getLibraryInfo()
    this.getBabyVoucherInfo()
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  inputTyping: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getBlury,
      data: {
        name: e.detail.value
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            serachPro: res.data.data
          })
        } else {
          that.setData({
            serachPro: []
          })
        }
      }
    })
  },
  btn_search_text: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    console.log(item);
    that.setData({
      isViewDisabled: true
    })
    wx.navigateTo({
      url: '/pages/newLibrary/selectedBookInfo/selectedBookInfo?id=' + item.id + '&name=' + item.name,
    })
  },

  // 筛选组件开关
  slideFilterClick() {
    wx.hideTabBar()
    this.setData({
      'filterData.filterShow': true
    })
  },
  // 筛选组件回调
  filterCallback(e) {
    console.log('筛选组件数据', e.detail)
    this.setData({
      'selectedData': e.detail
    })
  },
  // 获取页面信息
  getReadingMallInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Shop/shop_index`,
      data = {}
    app.wxRequest(url, data, (res) => {
      console.log('童书馆', res)
      if (res.data.code == 1) {
        for (let i = 0; i < res.data.data.banner.length; ++i) {
          res.data.data.banner[i].value = app.ossImgUrl + res.data.data.banner[i].value
        }
        this.setData({
          'banner': res.data.data.banner,
          'shop': res.data.data.shop
        })
      }
    })
  },
  // 更多团购列表跳转
  toGroupBuyingList(e) {
    let id = e.currentTarget.dataset.item.id // 团购列表id
    wx.navigateTo({
      url: '/pages/readingMall/moreGroupList/moreGroupList?id=' + id,
    })
  },
  // 爆款列表跳转
  toHotBookList(e) {
    let id = e.currentTarget.dataset.item.id // 爆款列表id
    wx.navigateTo({
      url: '/pages/readingMall/moreSingleList/moreSingleList?id=' + id,
    })
  },
  // 新款列表跳转
  toNewBookList(e) {
    let id = e.currentTarget.dataset.item.id // 新款列表id
    wx.navigateTo({
      url: '/pages/readingMall/moreSingleList/moreSingleList?id=' + id,
    })
  },
  // 获取侧边滑动栏信息
  getFilterDataInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Shop/screen`,
      data = {}
    app.wxRequest(url, data, (res) => {
      console.log('侧边栏', res)
      if (res.data.code == 1) {
        let panelList = this.data.filterData.panelList
        this.setData({
          'panelList': res.data.data
        })
        self.selectComponent('#filter').init()
      }
    })
  },
  // 筛选页面跳转
  _confirmBtnTap() {
    for (let i = 0; i < this.data.selectedData.filterKeyword.length; ++i) {
      if (this.data.selectedData.filterKeyword[i].name == 's_id') {
        var s_id = this.data.selectedData.filterKeyword[i].value
      } else if (this.data.selectedData.filterKeyword[i].name == 'shop_label') {
        var shop_label = this.data.selectedData.filterKeyword[i].value
      } else if (this.data.selectedData.filterKeyword[i].name == 'price') {
        var price = this.data.selectedData.filterKeyword[i].value
      }
    }
    if (s_id || shop_label || price) {
      wx.navigateTo({
        url: '/pages/readingMall/catalogList/catalogList?s_id=' + s_id + '&shop_label=' + shop_label + '&price=' + price,
      })
    }else {
      wx.showToast({
        title: '请至少选择一个条件',
        icon: 'none',
        duration: 1000,
      })
      return
    }
  },
  // 爆款单本书详情跳转
  toBookDetail(e) {
    let id = e.currentTarget.dataset.item.id   // 单本书id
    wx.navigateTo({
      url: '/pages/newLibrary/selectedBookInfo/selectedBookInfo?id=' + id,
    })
  },
  // 团购书籍详情跳转
  toGroupBookDetail(e) {
    let id = e.currentTarget.dataset.item.id   // 单本书id
    wx.navigateTo({
      url: '/pages/readingMall/groupBookDetail/groupBookDetail?id=' + id,
    })
  },
  // 新款书籍详情跳转
  toNewBookDetail(e) {
    let id = e.currentTarget.dataset.item.id   // 单本书id
    wx.navigateTo({
      url: '/pages/newLibrary/selectedBookInfo/selectedBookInfo?id=' + id,
    })
  },
  // 获取精选书单
  getLibraryInfo() {
    let self = this, url = `${app.baseUrl}/interface/Library/new_index`, data = {}
    app.wxRequest(url, data, (res) => {
      console.log('精选书单', res)
      if (res.data.code == 1) {
        this.setData({
          'selected': res.data.data.selected,
        })
      }
    })
  },
  // 精选书单跳转
  toSelectedBookPage(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/package_library/pages/selectedBookList/selectedBookList?id=' + id,
    })
  },
  // 宝宝书券
  getBabyVoucherInfo() {
    let self = this, url = `${app.baseUrl}/interface/Shop/user_get_wise_comb`, data = {}
    data = {
      'openid': app.globalData.openId,
    }
    app.wxRequest(url, data, (res) => {
      console.log('宝宝书券', res)
      self.setData({
        'isNewUser': res.data.err_code
      })
    })
  },
  // 宝宝书券弹窗
  hideMystGift() {
    this.setData({
      'isNewUser': false,
    })
  },
  confirmBtnClick() {
    this.setData({
      'isNewUser': false,
    })
  },
})