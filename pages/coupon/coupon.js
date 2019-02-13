var app = getApp();
Page({
  data: {
    tabs: ["未使用", "已使用", "已过期"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    couponData: [],
    typeNum: 1,
    money: 0,
    isLoading: false
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        if (options.typeNum == 1) {
          that.setData({
            sliderLeft: res.windowWidth - (that.data.tabs.length - 0) * res.windowWidth / that.data.tabs.length,
            sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
            typeNum: options.typeNum,

          });
        } else {
          that.setData({
            sliderLeft: res.windowWidth - (that.data.tabs.length - 0) * res.windowWidth / that.data.tabs.length,
            sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
            typeNum: options.typeNum,
            money: options.money
          });
        }
      }
    });
    that.getCouponData(1);
  },
  onShareAppMessage: function(res) {
    if (res.from == 'button') {
      console.log('分享优惠券',res)
      let id = res.target.dataset.item.id  // 优惠券id
      return {
        title: '美丽花亲子时光',
        path: '/pages/couponGift/couponGift?id=' + id,
        imageUrl: app.packageImg + 'shareCoupon.png'
      }
    }
  },
  tabClick: function (e) {
    var that = this;
    if (e.currentTarget.id == 0) {
      that.getCouponData(1);
    } else if (e.currentTarget.id == 1) {
      that.getCouponData(2);
    } else if (e.currentTarget.id == 2) {
      that.getCouponData(3);
    }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      isLoading: false
    });
  },
  getCouponData: function (typeNum) {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getCoupon,
      data: {
        openid: app.globalData.openId,
        type: typeNum
      },
      success: function (res) {
        console.log('优惠券', res)
        if (res.data.code == 1) {
          that.setData({
            couponData: res.data.data.coupon,
            isLoading: true
          })
        } else {
          that.setData({
            isLoading: true,
            couponData: []
          })
          
        }
      }
    })
  },
  btn_coupon: function (e) {
    var that = this;
    app.globalData.couponObj = e.currentTarget.dataset.item;
    wx.navigateBack({
      delta: 1
    })
  },

})