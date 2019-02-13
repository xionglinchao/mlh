const app = getApp()

Page({
  data: {
    // 活动场所
    activPlaceList: [
      '家中',
      '社区',
      '幼儿园',
      '少年宫',
      '学校',
      '早教中心',
      '图书馆',
      '自定义',
    ],
    selectPlaceIndex: -1,
    canPlaceInput: true
  },
  onLoad: function (options) {
    this.setData({
      'id': options.id || null,  // 活动id
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getDelaultAddress()
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
  placeInputBlur(e) {
    const { value } = e.detail
    if (value) {
      this.setData({
        'canPlaceInput': false,
        'customPlace': value
      })
    }
  },
  // 跳转首页
  toHomePage() {
    wx.reLaunch({
      url: '/pages/homepage/homepage',
    })
  },
  // 活动场所点击选中事件
  activPlaceClick(e) {
    const { idx } = e.currentTarget.dataset
    let place = e.currentTarget.dataset.item
    this.setData({
      selectPlaceIndex: idx,
      place: place
    })
  },
  // 收货地址选择
  addAddress() {
    wx.navigateTo({
      url: '/pages/address/address?info=2',
    })
  },
  // 获取默认地址
  getDelaultAddress: function () {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getDefaultAddress,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            isAddress: 1,
            defaultAddressPro: res.data.data,
            isLoading3: true
          })
        } else {
          that.setData({
            isAddress: -1,
            isLoading3: true
          })
        }
      }
    })
  },
  // 表单数据提交
  btn_submit: function(e) {
    // console.log(e)
    let self = this, item = e.detail.value
    if(item.name == '') {
      wx.showToast({
        title: '请输入称呼',
        icon: 'none',
        duration: 1000
      })
    } else if(item.family == '') {
      wx.showToast({
        title: '请输入预计组织人数',
        icon: 'none',
        duration: 1000
      })
    } else if(!self.data.place) {
      wx.showToast({
        title: '请选择活动场所',
        icon: 'none',
        duration: 1000
      })
    } else if (item.applyActivi == '') {
      wx.showToast({
        title: '请输入申请活动内容',
        icon: 'none',
        duration: 1000
      })
    } else if (self.data.defaultAddressPro.id == '') {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 1000
      })
    } else {
      let url = `${app.baseUrl}/interface/Find/app_mom`, data = {}
      data = {
        'id': self.data.id,
        'openid': app.globalData.openId,
        'name': item.name,
        'held': item.volunteer,
        'expect_num': item.family,
        'place': self.data.place,
        'app_con': item.applyActivi,
        'address': self.data.defaultAddressPro.id,
        'wechat': item.weChat
      }
      app.wxRequest(url, data, (res) => {
        console.log('提交结果',res)
        if(res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000,
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }
      })
    }
  },
})